
import { GoogleGenAI } from "@google/genai";

export const generateAIImage = async (
  prompt: string,
  mode: string,
  activeFunction: string,
  image1: string | null,
  image2: string | null,
  aspectRatio: string
): Promise<string> => {
  const API_KEY = process.env.API_KEY || "";
  if (!API_KEY) {
    throw new Error("Chave de API não encontrada. Por favor, selecione sua chave.");
  }

  // Create a new GoogleGenAI instance right before making an API call to ensure 
  // it always uses the most up-to-date API key from the dialog.
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const modelName = 'gemini-3-pro-image-preview';

  let finalPrompt = prompt;
  if (mode === 'create') {
    switch (activeFunction) {
      case 'sticker': finalPrompt = `Professional die-cut sticker of: ${prompt}. Isolated on white background, thick white border, 2d vector style, high quality.`; break;
      case 'text': finalPrompt = `Modern minimalist logo for: ${prompt}. Professional graphic design, vector, flat style.`; break;
      case 'comic': finalPrompt = `Professional comic book panel: ${prompt}. Detailed line art, vibrant colors, dynamic composition.`; break;
    }
  }

  const parts: any[] = [{ text: finalPrompt }];

  if (image1) {
    parts.unshift({
      inlineData: {
        data: image1.split(',')[1],
        mimeType: 'image/png'
      }
    });
  }

  if (image2) {
    parts.push({
      inlineData: {
        data: image2.split(',')[1],
        mimeType: 'image/png'
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Nenhuma imagem gerada.");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
