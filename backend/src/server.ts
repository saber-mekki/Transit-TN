import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as tripRoutes } from './routes/trips';
import { router as authRoutes } from './routes/auth';
import { router as stationRoutes } from './routes/stations';
import { router as locationRoutes } from './routes/locations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({}));

// API Routes
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/locations', locationRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});