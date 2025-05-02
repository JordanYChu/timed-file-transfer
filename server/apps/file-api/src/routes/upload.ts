import { Request, Response } from 'express';
import { uploadToS3 } from '../s3';
import prisma from '../prisma';
import { v4 as uuid } from 'uuid';

export default async function uploadFileHandler(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }
  console.log("uploadfilehandler");
  const { userId, receiverId } = req.body;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  // 1. Upload file bytes to MinIO/S3
  const fileKey = `${userId}/${uuid()}_${req.file.originalname}`;
  try {
    await uploadToS3(req.file.buffer, fileKey);
  } catch (err) {
    console.error('S3 upload failed', err);
    res.status(500).json({ error: 'Upload failed' });
    return;
  }

  // 2. Create a record in Postgres
  const fileRecord = await prisma.file.create({
    data: {
      filename: req.file.originalname,
      s3Key: fileKey,
      fileSize: BigInt(req.file.size),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // e.g. 1 day
      senderId: userId,
      receiverId: receiverId || null,
    },
  });

  // 3. Return success
  res.json({
    id: fileRecord.id,
    key: fileKey,
    url: `/download/${fileRecord.id}`,
  });
}
