import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tripRoutes from './routes/trips';
import authRoutes from './routes/auth';
import stationRoutes from './routes/stations';
import locationRoutes from './routes/locations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/locations', locationRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
