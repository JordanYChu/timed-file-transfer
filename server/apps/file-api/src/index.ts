import 'dotenv/config'; // loads .env into process.env
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import uploadFileHandler from './routes/upload';
import newUserHandler from './routes/register-user'
import {retrieveUserFiles, retrieveUserFileLink} from './routes/user-files';
import { deleteFileHandler } from './routes/delete';
import { shareFile, retrieveSharedFiles } from './routes/sharing';


import { authenticate } from './auth';
// At the top of your main entry point


const app = express();
app.use(cors());
app.use(express.json());

// multer will buffer uploads in memory (for large files you can stream instead)
const upload = multer({ storage: multer.memoryStorage() });

app.use(authenticate)

app.post('/upload', upload.single('file'), uploadFileHandler);
app.post('/register-user', upload.none(), newUserHandler);
app.get('/user-files', upload.none(), retrieveUserFiles);
app.get('/file-link', upload.none(), retrieveUserFileLink)
app.get('/delete-file', upload.none(), deleteFileHandler)
app.get('/sharing', upload.none(), shareFile)
app.get('/get-shared', upload.none(), retrieveSharedFiles)

app.listen(3000, () => {
  console.log('File API listening on http://localhost:3000');
});
