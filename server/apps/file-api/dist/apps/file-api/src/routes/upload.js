"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = uploadFileHandler;
const s3_1 = require("../s3");
const prisma_1 = __importDefault(require("../prisma"));
const uuid_1 = require("uuid");
function uploadFileHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.file) {
            res.status(400).json({ error: 'No file provided' });
            return;
        }
        console.log("uploadfilehandler");
        console.log('Request body:', req.body);
        const { userId, receiverId } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'Missing userId' });
            return;
        }
        const UserLimit = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { storageSpace: true }
        });
        if (!UserLimit) {
            res.status(400).json({ error: 'Userlimit not set' });
            return;
        }
        var totalStored = yield prisma_1.default.file.aggregate({
            _sum: {
                fileSize: true,
            },
            where: {
                senderId: userId,
                status: { in: ['PENDING', 'ACCEPTED', 'DOWNLOADED', 'EXPIRED'] }
            }
        });
        if (totalStored._sum.fileSize == null) {
            totalStored._sum.fileSize = BigInt(0);
        }
        if ((BigInt(req.file.size) + (totalStored._sum.fileSize)) > UserLimit.storageSpace) {
            res.status(400).json({ error: 'Out of User Storage' });
            return;
        }
        // 1. Upload file bytes to MinIO/S3
        const fileKey = `${userId}/${(0, uuid_1.v4)()}_${req.file.originalname}`;
        try {
            yield (0, s3_1.uploadToS3)(req.file.buffer, fileKey);
        }
        catch (err) {
            console.error('S3 upload failed', err);
            res.status(500).json({ error: 'Upload failed' });
            return;
        }
        // 2. Create a record in Postgres
        const fileRecord = yield prisma_1.default.file.create({
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
    });
}
