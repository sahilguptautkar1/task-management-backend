import express from 'express';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db';
import taskRoutes from './routes/tasks';

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
