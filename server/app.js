// server/app.js
import express from "express";
import cors from "cors";
import multer from "multer";
import api from "./api.js";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Routes
app.post("/api/parse-file", upload.array("files"), api.parseFile);
app.post("/api/parse-text", api.parseText);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
