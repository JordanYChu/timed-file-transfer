import { Request, Response } from 'express';
import { deleteFromS3 } from '../s3';
import prisma from '../prisma';


export async function deleteFileHandler(req: Request, res: Response): Promise<void> {
  try {
    // Extract the file ID from the request query
    const { fileId } = req.query;

    if (!fileId) {
      res.status(400).json({ error: 'File ID is required' });
      return;
    }

    // Extract the authenticated user's ID (set by the `authenticate` middleware)
    const userId = (req as any).user?.user_id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
    }

    // Query Prisma to get the file's details, including senderId and receiverId
    const file = await prisma.file.findUnique({
      where: { id: fileId as string, status: { in: ['PENDING', 'ACCEPTED', 'DOWNLOADED', 'EXPIRED'] } },
      select: { s3Key: true, senderId: true, receiverId: true },
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Check if the user is the sender 
    if (file.senderId !== userId) {
      res.status(403).json({ error: 'Access denied: You do not have permission to delete this file' });
      return;
    }

    // Delete the S3 record
    if (!file.s3Key){
      res.status(404).json({ error: 'File not found' });
      return;
    }
    deleteFromS3(file.s3Key)

    // Update prisma to reflect deletion
    // TODO: Add deletion time as update to expiry time perhaps

    await prisma.file.update({
      where: { id: fileId as string },
      data: { status: 'DELETED', s3Key: null },
    });


  } catch (error) {
    console.error('Error Deleting:', error);
    res.status(500).json({ error: 'Failed to delete properly' });
  }
}