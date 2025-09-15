import { parseText, parseFiles } from "./parser.js";

const output = document.getElementById("output");

document.getElementById("parse-text-btn").addEventListener("click", async () => {
  const text = document.getElementById("text-input").value;
  const summary = await parseText(text);
  output.textContent = summary;
});

document.getElementById("parse-file-btn").addEventListener("click", async () => {
  const files = document.getElementById("file-input").files;
  const summaries = await parseFiles(files);
  output.textContent = JSON.stringify(summaries, null, 2);
});
