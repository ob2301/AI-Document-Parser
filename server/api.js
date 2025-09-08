import fs from "fs";
import { OpenAI } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

const llm = new OpenAI({ model: "gpt-4o-mini", temperature: 0.3 });

async function summarizeText(text) {
  return await llm.invoke(`Summarize the following document:\n\n${text}`);
}

export default {
  parseFile: async (req, res) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) return res.status(400).json({ error: "No files uploaded" });

      let summaries = [];
      for (const file of files) {
        let docs;
        if (file.mimetype === "application/pdf") docs = await new PDFLoader(file.path).load();
        else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
          docs = await new DocxLoader(file.path).load();
        else docs = await new TextLoader(file.path).load();

        const text = docs.map(d => d.pageContent).join("\n");
        const summary = await summarizeText(text);
        summaries.push({ file: file.originalname, summary });
        fs.unlinkSync(file.path);
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
      const summary = await summarizeText(text);
      res.json({ summary });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to parse text" });
    }
  },
};
