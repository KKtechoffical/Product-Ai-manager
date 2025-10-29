
import { GoogleGenAI, Type } from "@google/genai";
import { Product, MarketingCopy, ContentAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateDescription(productName: string, category: string): Promise<string> {
  try {
    const prompt = `Generate a compelling and concise product description (around 50-70 words) for a digital product named "${productName}" in the category "${category}". Focus on the key benefits for the user.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Failed to generate description. Please try again.";
  }
}

export async function generateMarketingCopy(product: Product): Promise<MarketingCopy> {
    try {
        const prompt = `
        Based on the following digital product, generate marketing copy.
        Product Name: ${product.name}
        Description: ${product.description}
        Category: ${product.category}
        Price: $${product.price}
        
        Return a JSON object with the following structure: { "adHeadline": "string", "adBody": "string", "socialMediaPost": "string" }.
        The ad headline should be catchy and under 10 words.
        The ad body should be persuasive and around 30-40 words.
        The social media post should be engaging, include 2-3 relevant hashtags, and be suitable for platforms like Twitter or LinkedIn.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    adHeadline: { type: Type.STRING },
                    adBody: { type: Type.STRING },
                    socialMediaPost: { type: Type.STRING }
                },
                required: ['adHeadline', 'adBody', 'socialMediaPost']
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating marketing copy:", error);
    throw new Error("Failed to generate marketing copy.");
  }
}

export async function analyzeContent(description: string): Promise<ContentAnalysis> {
  try {
    const prompt = `
        Analyze the following product description:
        "${description}"

        Provide an analysis in a JSON object with the following structure: { "tone": "string", "clarityScore": number, "suggestions": ["string"] }.
        - "tone": Describe the tone of the text (e.g., "Professional and confident", "Casual and friendly").
        - "clarityScore": A score from 1 to 10 on how clear and easy to understand the description is.
        - "suggestions": An array of 2-3 actionable suggestions to improve the description.
    `;
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tone: { type: Type.STRING },
                    clarityScore: { type: Type.NUMBER },
                    suggestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ['tone', 'clarityScore', 'suggestions']
            }
        }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw new Error("Failed to analyze content.");
  }
}
