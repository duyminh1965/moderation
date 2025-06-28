/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { RekognitionClient, DetectModerationLabelsCommand, StartContentModerationCommand } from '@aws-sdk/client-rekognition';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { v4 as uuidv4 } from 'uuid';
import { ModerationResultss } from '../types';
import { marshall } from '@aws-sdk/util-dynamodb';
import 'dotenv/config';
const region = process.env.REGION;

const credentials = {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
      };


const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient([{ region, credentials, }]));
const rekognition = new RekognitionClient([ region, credentials]);


//'[{ region: string; credentials: { accessKeyId: string; secretAccessKey: string; }; }]
const bedrock = new BedrockRuntimeClient([{ region, credentials, }]);
const s3 = new S3Client([{ region, credentials, }]);
const sns = new SNSClient([{ region, credentials, }]);

const TABLE_NAME = "moderation-results";
const SNS_TOPIC = "moderation-alerts!";
const bucket = process.env.S3_BUCKET!;

export const processContent = async (bucket: string, key: string) => {
  
  const key1 = decodeURIComponent(key.replace(/\+/g, ' '));    
  //const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key1 }));  
  const temp = new HeadObjectCommand({ Bucket: "my-savedata-app", Key: key1 })  
  console.log("dem 05")
  const head = await s3.send(temp);  
  const contentType = head.ContentType || '';
  const fileSize = head.ContentLength || 0;
  console.log("dem 06")
  const result: ModerationResultss = {
    id: uuidv4(),
    bucket,
    key,
    content_type: contentType,
    file_size: fileSize,
    timestamp: new Date().toISOString(),
    moderation_results: {},
    is_inappropriate: false,
    confidence_score: 0,
  };

  if (contentType.startsWith('image/')) {
    result.moderation_results = await analyzeImage(bucket, key1);
    console.log("dem 07")
  } else if (contentType.startsWith('video/')) {
    result.moderation_results = await analyzeVideo(bucket, key1);
    console.log("dem 08")
  } else if (contentType.startsWith('text/')) {
    result.moderation_results = await analyzeText(bucket, key);
    console.log("dem 09")
  }

  result.is_inappropriate = isContentInappropriate(result.moderation_results);
  result.confidence_score = calculateConfidence(result.moderation_results);
  console.log("dem 10")
  await storeModerationResult(result);

      if (result.is_inappropriate) {
        await sendNotification(result);
      }
  return result;
}

export const analyzeImage = async (bucket1: string, key: string) => {
  try {
    const name = decodeURIComponent(key.replace(/\+/g, ' '));    
    console.log("analyzeImage 1", name, bucket)
    const command = new DetectModerationLabelsCommand({
      Image: { S3Object: { Bucket: bucket, Name: name } },
      MinConfidence: 60,
    });
    console.log("analyzeImage 2 command" )
    const response = await rekognition.send(command);
    console.log("analyzeImage 3: response" )
    const moderation_results = {
      service: 'rekognition',
      labels: response.ModerationLabels,
      detected_inappropriate: (response.ModerationLabels?.length || 0) > 0,
    }
    const result: ModerationResultss = {
    id: uuidv4(),
    bucket,
    key,
    content_type: "png",
    file_size: 1280,
    timestamp: new Date().toISOString(),
    moderation_results,
    is_inappropriate: false,
    confidence_score: 0,
  };

  console.log("analyzeImage 4: KQ" )

  await storeModerationResult(result);
    console.log("analyzeImage 5: TC" )
    return moderation_results;
  } catch (error: any) {
    console.error('Rekognition error:', error);    
    return { service: 'rekognition', error: error.message };
  }
}

export const analyzeVideo = async (bucket1: string, key: string) => {
  try {
    console.log("analyzeVideo 1", bucket, key)
    const command = new StartContentModerationCommand({
      Video: { S3Object: { Bucket: bucket, Name: key } },
      MinConfidence: 60,
    });
    console.log("analyzeVideo 2", command)
    const response = await rekognition.send(command);
    console.log("analyzeVideo 3: ", response)

    return {
      service: 'rekognition_video',
      job_id: response.JobId,
      status: 'processing',
    };
  } catch (error: any) {
    console.error('Rekognition video error:', error);
    return { service: 'rekognition_video', error: error.message };
  }
}

const analyzeText = async (bucket: string, key: string) => {
  try {
    const object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const textContent = await streamToString(object.Body);

    const prompt = `\nAnalyze the following text for inappropriate content including:\n- Hate speech\n- Violence or threats\n- Adult content\n- Harassment or bullying\n- Spam or misleading information\n\nText to analyze: "${textContent}"\n\nRespond with JSON format:\n{\n  \"is_inappropriate\": true/false,\n  \"categories\": [\"category1\", \"category2\"],\n  \"confidence\": 0.0-1.0,\n  \"reasoning\": \"explanation\"\n}`;

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
      contentType: 'application/json',
      accept: 'application/json',
    });

    const response = await bedrock.send(command);
    const raw = await response.body?.transformToString();
    const parsed = JSON.parse(raw || '{}');
    const analysis = JSON.parse(parsed.content?.[0]?.text || '{}');

    return {
      service: 'bedrock',
      analysis,
      detected_inappropriate: analysis?.is_inappropriate || false,
    };
  } catch (error: any) {
    console.error('Bedrock error:', error);
    return { service: 'bedrock', error: error.message };
  }
}

const isContentInappropriate = (results: any): boolean => {
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
  console.log("store: bd", result);
  await dynamoClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: result,
  }));
  console.log("store: kt");
  
}


async function sendNotification(result: any) {
  const message = {
    alert: 'Inappropriate content detected',
    file: `s3://${result.bucket}/${result.key}`,
    confidence: result.confidence_score,
    timestamp: result.timestamp,
  };

  await sns.send(new PublishCommand({
    TopicArn: SNS_TOPIC,
    Subject: 'Content Moderation Alert',
    Message: JSON.stringify(message),
  }));
}

async function streamToString(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });
}

export const getAnalyzeText = async(bucket: string) => {
  try {
    //const object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const textContent = bucket; //await streamToString(object.Body);

    const prompt = `Analyze the following text for inappropriate content including:
                        - Hate speech
                        - Violence or threats
                        - Adult content
                        - Harassment or bullying
                        - Spam or misleading information
                    Text to analyze: "${textContent}"
                        Respond with JSON format:
                            {
                                "is_inappropriate": true/false,
                                "categories": ["category1", "category2"],
                                "confidence": 0.0-1.0,
                                "reasoning": "explanation"
                            }`;   

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
      contentType: 'application/json',
      accept: 'application/json',
    });
    
    const response = await bedrock.send(command);    
    const raw = await response.body?.transformToString();    
    const parsed = JSON.parse(raw || '{}');    
    const analysis = JSON.parse(parsed.content?.[0]?.text || '{}');    

    return `{
      service: 'bedrock',
      ${JSON.stringify(analysis, null, 2)},
      detected_inappropriate: ${analysis?.is_inappropriate || false},
    }` ;
  } catch (error: any) {
    console.error('Bedrock error:', error);
    return `{ service: 'bedrock', error: ${error.message} }`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getData = async () => {
  
  const data = {
    id: uuidv4(),
    bucket: "my-bucket",
    key: "uploads/image.png",
    content_type: "image/png",
    file_size: 1024,
    timestamp: new Date().toISOString(),
    moderation_results: {},
    is_inappropriate: false,
    confidence_score: 0,
  };

  await dynamoClient.send(
    new PutItemCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE!,
      Item: marshall(data),
    })
  );
  viewAllItems();

}

export const viewAllItems = async () => {
  const tableName="moderation-results"
  const command = new ScanCommand({ TableName: tableName });
  const response = await dynamoClient.send(command);
  const res = response.Items; 
  res?.map((e) => {
    console.log(e.moderation_results+"=>"+e )    
  })
  //console.log("Items:", phantu.confidence_score);
  return response.Items;
}