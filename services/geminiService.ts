
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";

export async function getTutorResponse(
  history: ChatMessage[],
  latestImage?: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // Format history for Gemini SDK
  const contents = history.map(msg => {
    const parts: any[] = [{ text: msg.text }];
    if (msg.image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: msg.image.split(',')[1] || msg.image
        }
      });
    }
    return {
      role: msg.role === 'user' ? 'user' : 'model',
      parts
    };
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 },
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response. Let's try looking at that step again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message.includes("429")) {
      return "I'm receiving too many requests right now. Let's take a quick breather and try again in a moment!";
    }
    return "Oops, something went wrong with my calculations. Could you try rephrasing that or uploading the image again?";
  }
}
