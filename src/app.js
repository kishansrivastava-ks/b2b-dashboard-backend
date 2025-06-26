import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import indexRoutes from './routes/indexRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://custb2b.mendt.in',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://erp.mendt.in',
];

// middlerware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('API is running...'));

app.use('/api', indexRoutes);

export default app;
