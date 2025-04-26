import { pipeline } from '@xenova/transformers';

let qaPipeline;

export async function analyzeDocument(text) {
  if (!qaPipeline) {
    qaPipeline = await pipeline('question-answering');
  }

  const questions = [
    "What is the total amount?",
    "What is the date?",
    "Who is the vendor?"
  ]; 

  const results = {};
  
  for (const question of questions) {
    try {
      const answer = await qaPipeline({ context: text, question });
      results[question] = answer.answer;
    } catch (error) {
      results[question] = "Not found";
    }
  }

  return results;
}