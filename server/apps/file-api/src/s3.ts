import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,    // required for MinIO
  region: 'auto',          // dummy or your region
});

export async function uploadToS3(buffer: Buffer, key: string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
  }));
  return key;
}
