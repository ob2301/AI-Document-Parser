import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.VITE_OPENAI_API_KEY, //openai product key
});
const openai = new OpenAIApi(configuration);

export async function generateQuiz(text) {
  const prompt = `Generate 5 multiple-choice questions from the following text with 4 options each and mark the correct answer: \n\n${text}`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 500,
  });

  //parsing response
  const raw = response.data.choices[0].text;
  const questions = raw
    .split("\n\n")
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      return {
        question: lines[0],
        options: lines.slice(1),
      };
    });

  return questions;
}
