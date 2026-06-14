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

app.post("/test", async (req, res) => {

  const options={
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: req.body.message
            }
          ]
        })
    }
  try {
    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
      options
    );

    const data = await response.json();

    //console.log(data.choices[0].message.content);

    res.send(data.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
});