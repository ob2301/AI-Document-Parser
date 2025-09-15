import { parseText, parseFile } from "./parser.js";

document.getElementById("parseTextBtn").addEventListener("click", async () => {
  const text = document.getElementById("textInput").value;
  const summary = await parseText(text);
  document.getElementById("summary").innerText = summary;
});

document.getElementById("parseFileBtn").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  const summary = await parseFile(file);
  document.getElementById("summary").innerText = summary;
});
