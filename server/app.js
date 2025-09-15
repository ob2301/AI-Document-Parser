import express from "express";
import multer from "multer";
import cors from "cors";
import api from "./api.js";

const upload = multer({ dest: "uploads/" });
const app = express();

app.use(cors());
app.use(express.json());

// LangChain-powered routes
app.post("/api/parseFile", upload.array("files"), api.parseFile);
app.post("/api/parseText", api.parseText);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
