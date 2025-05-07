import { Request, Response } from 'express';
import prisma from '../prisma';
import { getPresignedGetObjectUrl } from '../s3';

export async function retrieveUserFiles(req: Request, res: Response): Promise<void> {
  try {
    // Extract the userId from the authenticated user (set by the `authenticate` middleware)
    const userId = (req as any).user?.user_id;

    if (!userId) {
      console.log("no User ID found")
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
    }

    const userStore = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        storageSpace: true
      }
    })

    // Query Prisma to get all files where the user is the sender
    const files = await prisma.file.findMany({
      where: {
        senderId: userId,
        status: { in: ['PENDING', 'ACCEPTED', 'DOWNLOADED', 'EXPIRED'] }
      },
      select: {
        id: true,
        filename: true,
        fileSize: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        receiverId: true,
      },
    });

    // Convert BigInt fields to strings
    const formattedFiles = files.map(file => ({
      ...file,
      fileSize: file.fileSize.toString(), // Convert BigInt to string
    }));


    // Return the files as a JSON response
    res.json({...formattedFiles, totalStorage: userStore?.storageSpace.toString()});
  } catch (error) {
    console.error('Error retrieving user files:', error);
    res.status(500).json({ error: 'Failed to retrieve user files' });
  }
}



export async function retrieveUserFileLink(req: Request, res: Response): Promise<void> {
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

    // Check if the user is either the sender or the receiver of the file
    if (file.senderId !== userId && file.receiverId !== userId) {
      res.status(403).json({ error: 'Access denied: You do not have permission to access this file' });
      return;
    }

    // Generate a pre-signed URL for the file
    if (!file.s3Key){
      res.status(404).json({ error: 'File not found' });
      return;
    }
    const presignedUrl = await getPresignedGetObjectUrl(file.s3Key);
    // Return the pre-signed URL
    res.json({ url: presignedUrl });
  } catch (error) {
    console.error('Error retrieving pre-signed URL:', error);
    res.status(500).json({ error: 'Failed to retrieve pre-signed URL' });
  }
}