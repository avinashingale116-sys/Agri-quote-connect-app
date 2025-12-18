
import { GoogleGenAI, Type } from "@google/genai";
import { TractorService } from "./mockBackend";

export const getTractorAdvice = async (userPrompt: string): Promise<{ text: string, recommendedTractorId?: string }> => {
  // Use process.env.API_KEY directly as required by guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API_KEY not set. Returning mock AI response.");
    return {
       text: "Simulation: Based on your land size of 5 acres and sugarcane crop, a 45-50 HP tractor is recommended. I suggest checking the current inventory.",
       recommendedTractorId: 't1'
    };
  }

  try {
    // Correct initialization using a named parameter object with apiKey
    const ai = new GoogleGenAI({ apiKey });
    const tractors = TractorService.getAll();
    
    const inventoryContext = tractors.map(t => 
      `ID: ${t.id}, Brand: ${t.brand}, Model: ${t.model}, HP: ${t.hp}, Variant: ${t.variant}`
    ).join('\n');

    const systemInstruction = `
      You are an expert agricultural consultant helping a farmer in India choose a tractor.
      You have the following inventory of tractors available in our platform:
      ${inventoryContext}
      
      Analyze the user's requirement (acres, crop type, usage). 
      Recommend the best specific tractor ID from the list above.
      Provide a short, helpful explanation in simple English suitable for a farmer.
    `;

    // Updated model name to gemini-3-flash-preview for Basic Text Tasks per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            recommendedTractorId: { type: Type.STRING, description: "The ID of the tractor from the inventory list, or null if none fit." }
          },
          required: ["explanation"]
        }
      }
    });

    // The GenerateContentResponse features a 'text' property (not a method)
    const result = JSON.parse(response.text || '{}');
    return {
      text: result.explanation,
      recommendedTractorId: result.recommendedTractorId
    };

  } catch (error) {
    console.error("Gemini API Error", error);
    return {
      text: "Sorry, I am unable to connect to the advisory server right now. Please try again.",
    };
  }
};
