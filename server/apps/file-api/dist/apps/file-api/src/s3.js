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
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
exports.uploadToS3 = uploadToS3;
exports.deleteFromS3 = deleteFromS3;
exports.getPresignedGetObjectUrl = getPresignedGetObjectUrl;
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
exports.s3 = new client_s3_1.S3Client({
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // required for MinIO
    region: 'auto', // dummy or your region
});
function uploadToS3(buffer, key) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
        }));
        return key;
    });
}
function deleteFromS3(key) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        }));
        return key;
    });
}
function getPresignedGetObjectUrl(key_1) {
    return __awaiter(this, arguments, void 0, function* (key, expiresInSeconds = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        });
        // Generate a pre-signed URL
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(exports.s3, command, { expiresIn: expiresInSeconds });
        return url;
    });
}
