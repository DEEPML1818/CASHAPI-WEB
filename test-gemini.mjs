import { getGeminiCompletion } from './lib/gemini.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log("Testing Gemini API connectivity...");
    const prompt = "Say 'Gemini is active' and provide a 1-sentence greeting for an AI agent.";
    const result = await getGeminiCompletion(prompt);
    console.log("Result:", result);
}

test();
