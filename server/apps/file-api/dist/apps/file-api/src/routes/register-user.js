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
exports.default = newUserHandler;
const prisma_1 = __importDefault(require("../prisma"));
function newUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("registerUserHandler", req.body);
        const { id, name, email } = req.body;
        if (!id || !name || !email) {
            res.status(400).json({ error: 'id, name, email not provided' });
            return;
        }
        // 2. Create a record in Postgres
        const fileRecord = yield prisma_1.default.user.create({
            data: {
                id: id,
                name: name,
                email: email
            },
            select: {
                storageSpace: true,
                id: true,
                email: true,
                name: true,
            }
        });
        // 3. Return success
        res.json({
            id: fileRecord.id,
            name: fileRecord.name,
            storageSpace: fileRecord.storageSpace
        });
    });
}
