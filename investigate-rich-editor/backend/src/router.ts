import express from 'express';
import { query, validationResult } from 'express-validator';
import { DownloadFileRequestBody } from './@types/RequestBody';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { BASE_URL } from './config';
dotenv.config();

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_S3_BUCKET_NAME
) {
  console.error(
    'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME must be defined'
  );
  process.exit(1);
}

const getFileExtension = (filename: string) => {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) {
    return '';
  }
  return filename.slice(dotIndex + 1);
};

export const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const validAndResponse = (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return res;
};

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post(
  '/upload',
  upload.single('file'),
  async (req: express.Request, res: express.Response) => {
    try {
      if (!req.file) {
        throw new Error('File is required');
      }
      const originalName = req.file.originalname;
      const fileExtension = getFileExtension(originalName);

      const uuid = uuidv4();
      const key = `${
        process.env.AWS_S3_KEY_PREFIX ?? ''
      }/${uuid}.${fileExtension}`;
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);

      return res.status(200).json({
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        key,
        downloadUrl: `${BASE_URL}/download?bucketName=${process.env.AWS_S3_BUCKET_NAME}&key=${key}`,
      });
    } catch (error: any) {
      if (error.message) {
        return res.status(400).json({ message: error.message });
      }
      res.status(400).json({ message: 'Bad request' });
    }
  }
);

router.get(
  '/download',
  [
    query('bucketName')
      .exists()
      .withMessage('bucketName is required')
      .isString(),
    query('key').exists().withMessage('key is required').isString(),
  ],
  async (req: express.Request, res: express.Response) => {
    validAndResponse(req, res);
    try {
      const { bucketName, key } = req.query as DownloadFileRequestBody;
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      const fileExtension = getFileExtension(key);
      const mimetype = `image/${fileExtension}`;

      const { Body, ContentType } = await s3Client.send(command);
      res.setHeader(
        'Content-Type',
        mimetype ?? ContentType ?? 'application/octet-stream'
      );

      if (!Body) {
        throw new Error('File not found');
      }
      const streamByte = await Body.transformToByteArray();
      res.status(200).write(streamByte, 'binary');
      return res.end(null, 'binary');
    } catch (error: any) {
      if (error.message) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);
