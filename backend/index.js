require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { Pinecone } = require("@pinecone-database/pinecone");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const pinecone = new Pinecone({
  apiKey: process.env.PINE_CONE_API_KEY,
});
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
const indexName = "vector-namespace";

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

async function createIndex(indexName) {
  try {
    await pinecone.createIndex({
      name: indexName,
      dimension: 768,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
  } catch (error) {
    if (!error.message.includes("already exists")) {
      console.error("Error creating index:", error);
    }
  }
}
async function generateStructuredAnswer(question, chunks) {
  const prompt = `
    You are a helpful assistant specializing in summarizing and answering questions based on provided information.
    Only use the information provided in the text to answer the following question.
    Question: ${question}
    Relevant information: ${chunks.slice(0, 2).join("\n\n")}
    Answer concisely in 3-5 sentences:
`;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let answer = "";
  try {
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      answer += chunkText;
    }
  } catch (error) {
    console.log("Error:", error);
  }
  return answer;
}
function getChunks(text, chunkSize = 250) {
  const chunks = [];
  let currentChunk = "";
  const words = text.split(/\s+/);
  for (let word of words) {
    if ((currentChunk + word).length <= chunkSize) {
      currentChunk += (currentChunk ? " " : "") + word;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}
async function getEmbedding(chunks) {
  return Promise.all(
    chunks.map(async (chunk) => {
      const result = await model.embedContent(chunk);
      if (!result || !result.embedding || !result.embedding.values) {
        throw new Error("Failed to retrieve embedding values.");
      }
      return result.embedding.values;
    })
  );
}

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const username = req.body.username;

    if (!username) {
      return res.status(400).json({ error: "Please provide a username." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Please select a file to upload." });
    }

    const pdfBuffer = req.file.buffer;
    let text = await pdfParse(pdfBuffer);
    text = text.text;
    const chunks = getChunks(text);
    const embeddings = await getEmbedding(chunks);

    const vectors = embeddings.map((embedding, i) => ({
      id: `${username}-${i}`,
      values: embedding,
      metadata: {
        username,
        chunkIndex: i,
        text: chunks[i],
      },
    }));

    const index = pinecone.index(indexName);
    await index.upsert(vectors);

    res.status(200).json({
      message: "File uploaded successfully",
      chunksProcessed: vectors.length,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      error: "Error processing file",
      details: error.message,
    });
  }
});

app.post("/ask", async (req, res) => {
  try {
    const { question, username } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Please provide a question." });
    }
    if (!username) {
      return res.status(400).json({ error: "Please provide a username." });
    }

    const quesEmbedding = await model.embedContent(question);
    const index = pinecone.index(indexName);
    const threshold = 0.4;
    const results = await index.query({
      vector: quesEmbedding.embedding.values,
      filter: { username },
      topK: 3,
      includeMetadata: true,
    });
    const relevantMatches = results.matches
      .filter((match) => match.score >= threshold)
      .slice(0, 2);
    if (!results.matches || results.matches.length === 0) {
      return res.status(404).json({ error: "No matching chunk found." });
    }
    if (!relevantMatches.length) {
      res.status(404).json({
        error: "No relevant matches found above the similarity threshold.",
      });
    } else {
      const structuredAnswer = await generateStructuredAnswer(
        question,
        relevantMatches.map((match) => match.metadata.text)
      );
      res.status(200).json({ answer: structuredAnswer });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error processing structured answer",
      details: error.message,
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const prompt = "who is kevin de bruyne?";
    const answer = await model.embedContent(prompt);
    res.send(answer.embedding.values);
  } catch (error) {
    res.status(500).send("Error processing request.");
  }
});

(async () => {
  await createIndex(indexName);
  app.listen(8000, () => console.log("Server is running on port 8000"));
})();
