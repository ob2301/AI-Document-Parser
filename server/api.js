// server/api.js
import fs from "fs";
import { OpenAI } from "@langchain/openai";
import { PDFLoader, DocxLoader, TextLoader } from "@langchain/document-loaders";

// Initialize LLM
const llm = new OpenAI({ model: "gpt-4o-mini", temperature: 0.3 });

// Simple redaction function
function redactSensitiveInfo(text) {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "XXXXX")
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "XXXXX");
}

// Summarize text
async function summarizeText(text) {
  const prompt = `Summarize the following text. Redact sensitive info:\n\n${text}`;
  const summary = await llm.invoke(prompt);
  return redactSensitiveInfo(summary);
}

export default {
  parseFile: async (req, res) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) return res.status(400).json({ error: "No files uploaded" });

      const summaries = [];

      for (const file of files) {
        let loader;
        if (file.mimetype === "application/pdf") loader = new PDFLoader(file.path);
        else if (
          file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
          loader = new DocxLoader(file.path);
        else loader = new TextLoader(file.path);

        const docs = await loader.load();
        const text = docs.map((d) => d.pageContent).join("\n");
        const summary = await summarizeText(text);

        summaries.push({ file: file.originalname, summary });

        fs.unlinkSync(file.path); // delete after processing
      }

      res.json({ summaries });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to parse files" });
    }
  },

  parseText: async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "No text provided" });

      const summary = await summarizeText(text);
      res.json({ summary });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to parse text" });
    }
  },
};
