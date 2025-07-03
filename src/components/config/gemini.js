import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const API_KEY = "AIzaSyDD-cqsSmfFvRmcueENm2ZTGlt1CLDvmbk";
const MODEL_NAME = "models/gemini-2.5-pro";




async function runChat(userPrompt) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const friendlyPrompt = `
You are a helpful and friendly AI assistant. 
Reply like a human in a clear, casual, and short tone.
No robotic responses. Always sound warm and natural.

Q: ${userPrompt}
A:
    `.trim();

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: friendlyPrompt }] }],
      generationConfig: {
        temperature: 0.85,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const response =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return response?.trim() || "🤖 Oops! I didn’t catch that. Try again?";
  } catch (error) {
    return "❌ Gemini Error: " + error.message;
  }
}

export default runChat;
