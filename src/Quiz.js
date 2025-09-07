import React, { useState } from "react";
//using react to write html like syntax since were in JS
//using useState to store answers

export default function Quiz({ questions }) {//questions here is an array of question objects were using as input
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));//useState to keep track of answers, one empty string per Q, with answers[i] holding selected option for ith Q

  const handleChange = (i, value) => {//question and option selected by user
    const newAnswers = [...answers];//NEVER MUTATE STATE DIRECTLY! (thats why we create a copy!!)
    newAnswers[i] = value;
    setAnswers(newAnswers);
  };

  return (//rendering the quiz, boring stuff
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
                onChange={() => handleChange(i, opt)} //this updates the state when clicked
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
