import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.VITE_OPENAI_API_KEY, //openai product key, storing inside env var for security 
});
const openai = new OpenAIApi(configuration); //new openai api client

export async function generateQuiz(text) { //construct the prompt that we will send to the llm
  const words = text.split(/\s+/).length;
  const numQuestions = Math.min(5 + Math.floor(words/200),1000); //5 + 1 question per 200 words, max is 1000, can be changed depending on interview
  const prompt = `Generate ${numQuestions} multiple-choice questions from the following text with 4 options each and mark the correct answer: \n\n${text}`;

  const response = await openai.createCompletion({ //completion endpoint
    model: "text-davinci-003", //gpt3.5
    prompt,
    max_tokens: 500 + numQuestions * 50,//arbitrary max token limit, shouldnt be exceeded, already communicated to IT team
  });

  //parsing response
  const raw = response.data.choices[0].text; 
  const questions = raw
    .split("\n\n")//just splitting into blocks and then lines
    .filter(Boolean)//removing empty strings
    .map((block) => {
      const lines = block.split("\n");
      return {
        question: lines[0], //line 1 is the questions, the rest are the answer options
        options: lines.slice(1),
      };
    });

  return questions;
}
