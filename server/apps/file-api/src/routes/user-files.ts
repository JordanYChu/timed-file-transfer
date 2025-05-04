import { Request, Response } from 'express';
import prisma from '../prisma';

export default async function retrieveUserFiles(req: Request, res: Response): Promise<void> {
  try {
    // Extract the userId from the authenticated user (set by the `authenticate` middleware)
    const userId = (req as any).user?.user_id;

    if (!userId) {
      console.log("no User ID found")
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
    }

    // Query Prisma to get all files where the user is the sender
    const files = await prisma.file.findMany({
      where: {
        senderId: userId,
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
    res.json(formattedFiles);
  } catch (error) {
    console.error('Error retrieving user files:', error);
    res.status(500).json({ error: 'Failed to retrieve user files' });
  }
}