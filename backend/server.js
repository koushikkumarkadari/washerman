// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/authRoutes.js';
import userrouter from './routes/userRoutes.js';
import paymentrouter from './routes/paymentRoutes.js';
import adminrouter from './routes/adminRoutes.js';
import washermanrouter from './routes/washermanRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://washerman.vercel.app',
      'https://washerman-koushikkadari-s-projects.vercel.app'

    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/payments', paymentrouter);
app.use('/api/auth', router);
app.use('/api/user/washermen', userrouter);
app.use('/api/orders', userrouter);
app.use('/api/admin', adminrouter);
app.use('/api/washermen', washermanrouter);

// DB & Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
});
