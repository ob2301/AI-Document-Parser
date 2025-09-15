const API_URL = "http://localhost:5000/api";

export async function parseText(text) {
  if (!text.trim()) return "Please enter some text.";
  try {
    const res = await fetch(`${API_URL}/parseText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    return data.summary || "No summary found.";
  } catch (err) {
    console.error(err);
    return "Failed to parse text.";
  }
}

export async function parseFile(file) {
  if (!file) return "Please choose a file.";
  try {
    const formData = new FormData();
    formData.append("files", file);

    const res = await fetch(`${API_URL}/parseFile`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.summaries?.[0]?.summary || "No summary found.";
  } catch (err) {
    console.error(err);
    return "Failed to parse file.";
  }
}
