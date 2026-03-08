import { GoogleGenAI } from "@google/genai";

export const generateLogo = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: "A minimalist, luxury logo for a brand named 'BitNexus'. The logo should feature a sophisticated abstract symbol representing a 'nexus' or 'connection' (like interlocking geometric lines or a stylized 'N') combined with a subtle digital 'bit' element. Color palette: Deep Charcoal (#0A0A0A) and Premium Sunset Orange (#F27D26). Style: Clean, modern, high-end, vector-like, professional branding, white background.",
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
