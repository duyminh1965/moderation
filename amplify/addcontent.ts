"use server";
import { AttributeValue, DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import 'dotenv/config';
import { ModerationResult, ModerationResultss } from '../types';
import { unmarshall } from '@aws-sdk/util-dynamodb';


const region = process.env.REGION!;
const credentials = {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
      };
const s3 = new S3Client({ region, credentials });

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient([{ region, credentials, }]));

export const  addURL = async ( filename: string, contentType: string) => {   
  try {
    const key = `uploads/${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType,
    });        
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });       
    
    return signedUrl;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export const viewAllItems = async () => {
  const tableName="moderation-results"
  const command = new ScanCommand({ TableName: tableName });
  const response = await dynamoClient.send(command);  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = response.Items?.map(item => unmarshall(item)) as any[];
  res.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const results: { content: string | undefined; type: string | undefined; status: string; confidence: string | undefined; flags: string[]; processingTime: number; }[] = []  
  res?.map((e) => { 
    if (e.content_type.startsWith('image/')){      
      const id = e.id;
      const content = {"name": e.key};
      //content.push({"name": e.key.S});
      const type = e.content_type;
      console.log("e.moderation_results.labels:", e.moderation_results.labels)
      const flags = assignFlags(e.moderation_results.labels);      
      const confidence = e.confidence_score*100;
      const status = determineStatus(confidence/100);
      const timestamp = e.timestamp;
      //flags.push('excessive-length');
      const pt =  {
        id,
        content,
        type,
        status,
        confidence,
        flags,
        processingTime: 2000 + Math.random() * 3000,
        timestamp
      };
      results.push(pt);      
    }
    else if ( e.content_type.startsWith("textttt/") || e.content_type === "application/pdfttt" || e.content_type === "application/mswordttt" ||
      e.content_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.documentttt"
      ) {
        console.log("TXT: ", e);
    }
  })
   return results;
}

export const gepImages = async (): Promise<ModerationResult[]> => {
  
  const tableName = "moderation-results";

  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": { S: "some-user-or-partition-id" }, // Replace with actual partition key
    },
    ScanIndexForward: false, // false = descending (latest first), true = ascending
  });

    const response = await dynamoClient.send(command);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const items = response.Items?.map((item) => unmarshall(item));
    const results: ModerationResult[] = []  
    items?.map((e) => {    
    
    if (e.content_type.S.startsWith('image/')){      
      const id = e.id;
      const content = {"name": e.key};
      //content.push({"name": e.key.S});
      const type = e.content_type;
      const flags = assignFlags(e.moderation_results.labels);      
      const confidence = e.confidence_score*100;
      const status = determineStatus(confidence/100);
      const timestamp = e.timestamp;
      //flags.push('excessive-length');
      const pt =  {
        id,
        content,
        type,
        status,
        confidence,
        flags,
        processingTime: 2000 + Math.random() * 3000,
        timestamp
      };
      results.push(pt);      
    }
  })
  return results;
};

const determineStatus = (confidence: number): 'approved' | 'flagged' | 'rejected' => {
  if (confidence >= 0.75) return 'rejected';
  if (confidence >= 0.4) return 'flagged';

  return 'approved';
}

function assignFlags(labels: { Name: string }[]): string[] {
  const flags = new Set<string>();

  for (const label of labels) {
    const name = label.Name.toLowerCase();

    if (name.includes('violence') || name.includes('weapon')) flags.add('violence');
    if (name.includes('nudity') || name.includes('sexual') || name.includes('adult') || name.includes('suggestive')) flags.add('adult-content');
    if (name.includes('hate') || name.includes('offensive') || name.includes('inappropriate')) flags.add('inappropriate-content');
    if (name.includes('spam') || name.includes('scam') || name.includes('misinformation') || name.includes('clickbait')) flags.add('spam');
    if (name.includes('copyright') || name.includes('piracy')) flags.add('copyright');
  }

  return Array.from(flags);
}




