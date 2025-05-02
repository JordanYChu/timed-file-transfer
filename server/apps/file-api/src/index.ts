import 'dotenv/config'; // loads .env into process.env
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import uploadFileHandler from './routes/upload';
import { authenticate } from './auth';
// At the top of your main entry point


const app = express();
app.use(cors());
app.use(express.json());

// multer will buffer uploads in memory (for large files you can stream instead)
const upload = multer({ storage: multer.memoryStorage() });

app.use(authenticate)

app.post('/upload', upload.single('file'), uploadFileHandler);

app.listen(3000, () => {
  console.log('File API listening on http://localhost:3000');
});
