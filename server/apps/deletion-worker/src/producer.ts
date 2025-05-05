import cron from 'node-cron';

// Add a declaration for 'node-cron' if TypeScript complains about missing types

import prisma from './prisma';
import { deleteQueue } from './queue'; // Adjusted the path to the correct location

const GRACE_MS = 1 * 60 * 1000;    // 1 minute grace


// Every 1 minute
cron.schedule('*/1 * * * *', async () => {
  const cutoff = new Date(Date.now() - GRACE_MS);

  // Find files that expired (and haven’t been queued yet)
  const expired = await prisma.file.findMany({
    where: {
      expiresAt: { lt: cutoff },
      status: { in: ['PENDING', 'ACCEPTED', 'DOWNLOADED', 'EXPIRED'] },
    },
    take: 100,
  });

  for (const file of expired) {
    // Mark as EXPIRED -> DELETING so we don’t enqueue again
    await prisma.file.update({
      where: { id: file.id },
      data: { status: 'DELETING' },
    });

    if (!file.s3Key) {
      console.error(`File ${file.id} has a null s3Key and cannot be deleted.`);
      continue; // Skip this file
    }

    await deleteQueue.add('delete-file', {
      fileId: file.id,
      s3Key: file.s3Key,
    });
    console.log(`Enqueued deletion for ${file.id}`);
  }
});
