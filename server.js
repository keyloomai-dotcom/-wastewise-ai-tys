import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("WasteWise backend running");
});

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const imageBase64 = req.file.buffer.toString("base64");

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Classify this waste item into compost, recycling, or garbage in Toronto. Return JSON with bin and reason.",
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${imageBase64}`,
            },
          ],
        },
      ],
    });

    res.json({ result: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error analyzing image");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});