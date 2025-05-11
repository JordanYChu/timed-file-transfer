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
exports.deleteFileHandler = deleteFileHandler;
const s3_1 = require("../s3");
const prisma_1 = __importDefault(require("../prisma"));
function deleteFileHandler(req, res) {
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
            // Check if the user is the sender 
            if (file.senderId !== userId) {
                res.status(403).json({ error: 'Access denied: You do not have permission to delete this file' });
                return;
            }
            // Delete the S3 record
            if (!file.s3Key) {
                res.status(404).json({ error: 'File not found' });
                return;
            }
            (0, s3_1.deleteFromS3)(file.s3Key);
            // Update prisma to reflect deletion
            // TODO: Add deletion time as update to expiry time perhaps
            yield prisma_1.default.file.update({
                where: { id: fileId },
                data: { status: 'DELETED', s3Key: null },
            });
        }
        catch (error) {
            console.error('Error Deleting:', error);
            res.status(500).json({ error: 'Failed to delete properly' });
        }
    });
}
