import { deleteQueue } from './queue';
import prisma from './prisma';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './s3';

deleteQueue.process('delete-file', async (job) => {
    const { fileId, s3Key } = job.data;
    try {
        const response = await s3.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: s3Key,
        }));
        // console.log(response.$metadata, " asdasd ", response.DeleteMarker, " awaaa ", response.RequestCharged)
        await prisma.file.update({
            where: { id: fileId },
            data: { status: 'DELETED', s3Key: null },
        });
        console.log(`Deleted file ${fileId}`);
    } catch (err) {
        console.error(`Failed to delete ${fileId}`, err);
        // Let Bull retry based on its default retry settings
        throw err;
    }
});