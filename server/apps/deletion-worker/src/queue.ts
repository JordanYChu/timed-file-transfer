import Queue from 'bull';

export const deleteQueue = new Queue<
  { fileId: string; s3Key: string }
>('file-deletions', {
  redis: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
});
