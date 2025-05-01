import 'dotenv/config'; // loads .env into process.env
import express from 'express';
import multer from 'multer';

import uploadRoute from './routes/upload';

const app = express();
app.use(express.json());

// multer will buffer uploads in memory (for large files you can stream instead)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), uploadRoute);

app.listen(3000, '0.0.0.0', () => {
  console.log('File API listening on http://localhost:3000');
});
