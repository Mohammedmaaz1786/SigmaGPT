import express from 'express';
import "dotenv/config";
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB=async()=>{
  try
  {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// app.post("/test", async (req, res) => {

  
// });