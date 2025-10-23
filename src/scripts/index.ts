import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// ✅ Load your API Key from environment
const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY!;

// ✅ Initialize the Gemini API
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Safety Settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

//  Generation Config
const generationConfig = {
  temperature: 0.7, // Lower temperature for more focused responses
  topP: 0.9,
  maxOutputTokens: 4096, // Reduced token count for faster responses
};

//  Create the generative model for Gemini 2.0 Flash
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig,
  safetySettings,
});

//  Example chat session
export const chatSession = model.startChat({
  history: [], 
});
