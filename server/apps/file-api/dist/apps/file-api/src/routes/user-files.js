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
exports.retrieveUserFiles = retrieveUserFiles;
exports.retrieveUserFileLink = retrieveUserFileLink;
const prisma_1 = __importDefault(require("../prisma"));
const s3_1 = require("../s3");
function retrieveUserFiles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Extract the userId from the authenticated user (set by the `authenticate` middleware)
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
            if (!userId) {
                console.log("no User ID found");
                res.status(401).json({ error: 'Unauthorized: User ID not found' });
                return;
            }
            const userStore = yield prisma_1.default.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    storageSpace: true
                }
            });
            // Query Prisma to get all files where the user is the sender
            const files = yield prisma_1.default.file.findMany({
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
            const formattedFiles = files.map(file => (Object.assign(Object.assign({}, file), { fileSize: file.fileSize.toString() })));
            // Return the files as a JSON response
            res.json(Object.assign(Object.assign({}, formattedFiles), { totalStorage: userStore === null || userStore === void 0 ? void 0 : userStore.storageSpace.toString() }));
        }
        catch (error) {
            console.error('Error retrieving user files:', error);
            res.status(500).json({ error: 'Failed to retrieve user files' });
        }
    });
}
function retrieveUserFileLink(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Extract the file ID from the request query
            const { fileId } = req.query;
            if (!fileId) {
                res.status(400).json({ error: 'File ID is required' });
                return;
            }
            // Extract the authenticated user's ID (set by the `authenticate` middleware)
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized: User ID not found' });
                return;
            }
            // Query Prisma to get the file's details, including senderId and receiverId
            const file = yield prisma_1.default.file.findUnique({
                where: { id: fileId, status: { in: ['PENDING', 'ACCEPTED', 'DOWNLOADED', 'EXPIRED'] } },
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
            if (!file.s3Key) {
                res.status(404).json({ error: 'File not found' });
                return;
            }
            const presignedUrl = yield (0, s3_1.getPresignedGetObjectUrl)(file.s3Key);
            // Return the pre-signed URL
            res.json({ url: presignedUrl });
        }
        catch (error) {
            console.error('Error retrieving pre-signed URL:', error);
            res.status(500).json({ error: 'Failed to retrieve pre-signed URL' });
        }
    });
}
