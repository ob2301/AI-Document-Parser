import React, { useState } from "react";
import { generateQuiz } from "./api";
import Quiz from "./Quiz";

export default function App() {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleGenerate = async () => {
    const quiz = await generateQuiz(text);
    setQuestions(quiz);
  };

  return (
    <div className="container">
      <h1>AI Quiz Generator</h1>
      <textarea
        placeholder="Paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate Quiz</button>
      {questions.length > 0 && <Quiz questions={questions} />}
    </div>
  );
}
