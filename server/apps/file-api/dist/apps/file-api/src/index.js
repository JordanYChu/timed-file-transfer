"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // loads .env into process.env
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const upload_1 = __importDefault(require("./routes/upload"));
const register_user_1 = __importDefault(require("./routes/register-user"));
const user_files_1 = require("./routes/user-files");
const delete_1 = require("./routes/delete");
const sharing_1 = require("./routes/sharing");
const auth_1 = require("./auth");
// At the top of your main entry point
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// multer will buffer uploads in memory (for large files you can stream instead)
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.use(auth_1.authenticate);
app.post('/upload', upload.single('file'), upload_1.default);
app.post('/register-user', upload.none(), register_user_1.default);
app.get('/user-files', upload.none(), user_files_1.retrieveUserFiles);
app.get('/file-link', upload.none(), user_files_1.retrieveUserFileLink);
app.delete('/delete-file', upload.none(), delete_1.deleteFileHandler);
app.get('/sharing', upload.none(), sharing_1.shareFile);
app.get('/get-shared', upload.none(), sharing_1.retrieveSharedFiles);
app.listen(3000, () => {
    console.log('File API listening on http://localhost:3000');
});
