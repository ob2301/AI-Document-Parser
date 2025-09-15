import fs from "fs/promises";
import { OpenAI } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { LLMChain, PromptTemplate } from "langchain";

const llm = new OpenAI({ model: "gpt-4o-mini", temperature: 0.3 });

//GUARDRAIL REDACTION/OBFUSCATION
function redactSensitiveInfo(text) {
  //example regexes for emails, phones, SSNs
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "XXXXX")
    .replace(/\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, "XXXXX") // SSN
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "XXXXX"); // phone numbers
}

// guardrails to test obfuscation techniques/prompt engineering
const guardrailPrompt = new PromptTemplate({
  template: `
You are a document parser. Only extract information according to these rules:
1. Only summarize the content the user allows.
2. Replace sensitive information SUCH AS emails, social security numbers and phone numbers with XXXXX.
3. Be concise, AND DO NOT output more than what I have asked. 

Text to summarize:
{text}

Return the formatted summary.`,
  inputVariables: ["text"],
});

async function summarizeText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitText(text);
  const summaries = [];

  for (const chunk of chunks) {
    const chain = new LLMChain({ llm, prompt: guardrailPrompt });
    let summary = await chain.call({ text: chunk });
    summary = redactSensitiveInfo(summary.text || summary); // extra safety
    summaries.push(summary);
  }

  // Merge summaries into one
  const finalChain = new LLMChain({ llm, prompt: guardrailPrompt });
  let finalSummary = await finalChain.call({ text: summaries.join("\n") });
  finalSummary = redactSensitiveInfo(finalSummary.text || finalSummary);

  return finalSummary;
}

// ---- File loader ----
async function loadFile(file) {
  if (file.mimetype === "application/pdf") return await new PDFLoader(file.path).load();
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return await new DocxLoader(file.path).load();
  return await new TextLoader(file.path).load();
}

// ---- API ----
export default {
  parseFile: async (req, res) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) return res.status(400).json({ error: "No files uploaded" });

      const summaries = [];
      for (const file of files) {
        const docs = await loadFile(file);
        const text = docs.map((d) => d.pageContent).join("\n");
        const summary = await summarizeText(text);
        summaries.push({ file: file.originalname, summary });
        await fs.unlink(file.path);
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
