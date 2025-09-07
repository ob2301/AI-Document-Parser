import React, { useState } from "react";

export default function Quiz({ questions }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleChange = (i, value) => {
    const newAnswers = [...answers];
    newAnswers[i] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="quiz">
      {questions.map((q, i) => (
        <div key={i} className="question">
          <p>{q.question}</p>
          {q.options.map((opt, idx) => (
            <label key={idx}>
              <input
                type="radio"
                name={`q${i}`}
                value={opt}
                checked={answers[i] === opt}
                onChange={() => handleChange(i, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
