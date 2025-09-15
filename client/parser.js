// client/parser.js
//WRAPPER for fetch requests for index.js
// Parse plain text
export async function parseText(text) {
  const res = await fetch("http://localhost:5000/api/parse-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  return data.summary;
}

// Parse uploaded files
export async function parseFiles(files) {
  const formData = new FormData();
  for (let file of files) formData.append("files", file);

  const res = await fetch("http://localhost:5000/api/parse-file", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.summaries;
}
