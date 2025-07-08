import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cgpaRoutes from './routes/cgpaRoutes.js';  // ✅ Correct path & ESM default import

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/cgpa', cgpaRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected!'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
