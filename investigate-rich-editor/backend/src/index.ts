import express from 'express';
import cors from 'cors';
import { router } from './router';
import { API_PREFIX, BASE_URL, PORT } from './config';

const app = express();
app.use(cors());

app.use(API_PREFIX, router);

app.listen(PORT, () => {
  console.log(`Example app listening at ${BASE_URL}`);
});
