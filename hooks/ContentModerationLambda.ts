// TypeScript version of the AWS Lambda content moderation handler using AWS SDK v3

import { S3Handler, S3Event } from 'aws-lambda';
import { S3Client, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { RekognitionClient, DetectModerationLabelsCommand, StartContentModerationCommand } from '@aws-sdk/client-rekognition';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({});
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const rekognition = new RekognitionClient({});
const bedrock = new BedrockRuntimeClient({});
const sns = new SNSClient({});

const TABLE_NAME = process.env.DYNAMODB_TABLE || '';
const SNS_TOPIC = process.env.SNS_TOPIC_ARN || '';

export const handler: S3Handler = async (event: S3Event) => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      const result = await processContent(bucket, key);
      await storeModerationResult(result);

      if (result.is_inappropriate) {
        await sendNotification(result);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify('Content processed successfully')
    };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify(`Error processing content: ${error.message}`)
    };
  }
};

async function processContent(bucket: string, key: string) {
  const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  const contentType = head.ContentType || '';
  const fileSize = head.ContentLength || 0;

  const result: any = {
    id: uuidv4(),
    bucket,
    key,
    content_type: contentType,
    file_size: fileSize,
    timestamp: new Date().toISOString(),
    moderation_results: {},
    is_inappropriate: false,
    confidence_score: 0
  };

  if (contentType.startsWith('image/')) {
    result.moderation_results = await analyzeImage(bucket, key);
  } else if (contentType.startsWith('video/')) {
    result.moderation_results = await analyzeVideo(bucket, key);
  } else if (contentType.startsWith('text/')) {
    result.moderation_results = await analyzeText(bucket, key);
  }

  result.is_inappropriate = isContentInappropriate(result.moderation_results);
  result.confidence_score = calculateConfidence(result.moderation_results);

  return result;
}

async function analyzeImage(bucket: string, key: string) {
  try {
    const response = await rekognition.send(
      new DetectModerationLabelsCommand({
        Image: { S3Object: { Bucket: bucket, Name: key } },
        MinConfidence: 60
      })
    );

    return {
      service: 'rekognition',
      labels: response.ModerationLabels,
      detected_inappropriate: (response.ModerationLabels?.length || 0) > 0
    };
  } catch (error: any) {
    console.error('Rekognition error:', error);
    return { service: 'rekognition', error: error.message };
  }
}

async function analyzeVideo(bucket: string, key: string) {
  try {
    const response = await rekognition.send(
      new StartContentModerationCommand({
        Video: { S3Object: { Bucket: bucket, Name: key } },
        MinConfidence: 60
      })
    );

    return {
      service: 'rekognition_video',
      job_id: response.JobId,
      status: 'processing'
    };
  } catch (error: any) {
    console.error('Rekognition video error:', error);
    return { service: 'rekognition_video', error: error.message };
  }
}

async function analyzeText(bucket: string, key: string) {
  try {
    const object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const textContent = await streamToString(object.Body as any);

    const prompt = `Analyze the following text for inappropriate content including:\n- Hate speech\n- Violence or threats\n- Adult content\n- Harassment or bullying\n- Spam or misleading information\nText to analyze: "${textContent}"\nRespond with JSON format:\n{\n  "is_inappropriate": true/false,\n  "categories": ["category1", "category2"],\n  "confidence": 0.0-1.0,\n  "reasoning": "explanation"\n}`;

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const response = await bedrock.send(command);
    const payload = JSON.parse(Buffer.from(response.body!).toString());
    const aiText = payload.content[0].text;
    const analysis = JSON.parse(aiText);

    return {
      service: 'bedrock',
      analysis,
      detected_inappropriate: analysis?.is_inappropriate || false
    };
  } catch (error: any) {
    console.error('Bedrock error:', error);
    return { service: 'bedrock', error: error.message };
  }
}

function isContentInappropriate(results: any): boolean {
  return !results.error && results.detected_inappropriate;
}

function calculateConfidence(results: any): number {
  if (results.error) return 0;
  if (results.service === 'rekognition') {
    const confidences = results.labels?.map((l: any) => l.Confidence || 0);
    return confidences.length > 0 ? Math.max(...confidences) / 100 : 0;
  }
  if (results.service === 'bedrock') {
    return results.analysis?.confidence || 0;
  }
  return 0;
}

async function storeModerationResult(result: any) {
  await dynamo.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: result
  }));
}

async function sendNotification(result: any) {
  const message = {
    alert: 'Inappropriate content detected',
    file: `s3://${result.bucket}/${result.key}`,
    confidence: result.confidence_score,
    timestamp: result.timestamp
  };

  await sns.send(new PublishCommand({
    TopicArn: SNS_TOPIC,
    Subject: 'Content Moderation Alert',
    Message: JSON.stringify(message)
  }));
}

function streamToString(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}
