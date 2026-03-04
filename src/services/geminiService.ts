import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const analyzeIssue = async (description: string) => {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following home service issue description and provide:
      1. A suggested category (one of: Electrical, Plumbing, HVAC, Cleaning, Tech Support, Other)
      2. A brief summary of the likely problem.
      3. An estimated complexity level (Low, Medium, High).
      
      Description: "${description}"`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing issue with Gemini:", error);
    return null;
  }
};

export const generateOperationalInsights = async (stats: any) => {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following operational stats for a home service platform called BitNexus, generate 3 high-level strategic insights for the admin dashboard.
      
      Stats: ${JSON.stringify(stats)}
      
      Return the insights as a JSON array of objects with 'title', 'description', and 'type' (one of: 'alert', 'opportunity', 'efficiency').`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating insights with Gemini:", error);
    return [];
  }
};
