"use server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.REGION!;
const credentials = {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
      };
const s3 = new S3Client({ region, credentials });

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

