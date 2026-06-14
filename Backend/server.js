import express from 'express';
import "dotenv/config";
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.post("/test", async (req, res) => {

  
// });