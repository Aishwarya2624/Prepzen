import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GOOGLE_GENAI_API_KEY is not defined in .env.local");
}

// Simple and correct initialization for the latest library version
const genAI = new GoogleGenerativeAI(apiKey);

export const gemini = genAI;