import { Request, Response } from 'express';
import prisma from '../prisma';


export async function shareFile(req: Request, res: Response): Promise<void> {
  try {
    // Extract the file ID from the request query
    const { fileId, email } = req.query;

    if (!fileId || !email) {
      res.status(400).json({ error: 'File ID  and email is required' });
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

    const receiver = await prisma.user.findUnique({
      where: { email: email as string },
      select: {id: true}
    });

    if (!receiver?.id){
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Check if the user is the sender 
    if (file.senderId !== userId) {
      res.status(403).json({ error: 'Access denied: You do not have permission to share this file' });
      return;
    }

    await prisma.file.update({
      where: { id: fileId as string },
      data: { receiverId: file.receiverId as string },
    });


  } catch (error) {
    console.error('Error sharing:', error);
    res.status(500).json({ error: 'Failed to share properly' });
  }
}