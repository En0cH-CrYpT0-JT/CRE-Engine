
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Baseline: Asks Gemini to produce Pi digits directly.
 * Models often struggle with exact digit counts beyond ~20-50.
 */
export async function fetchBaselinePi(): Promise<{ text: string; latency: number }> {
  const start = performance.now();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Return π to exactly 100 decimal places. Output digits only. No spaces, no other text, just '3.' followed by 100 digits.",
      config: {
        temperature: 0.1, // Lower temperature for more consistent (though potentially still wrong) digits
      }
    });
    const latency = performance.now() - start;
    return { text: response.text.trim(), latency };
  } catch (error) {
    console.error("Baseline API Error:", error);
    return { text: "ERROR", latency: 0 };
  }
}

/**
 * C.R.E. Explanation: Only asks Gemini to explain the deterministic routing logic.
 */
export async function fetchCREExplanation(): Promise<{ text: string; latency: number }> {
  const start = performance.now();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Briefly explain (max 2 sentences) why routing a 100-digit Pi calculation to a deterministic BigInt function is superior to LLM token prediction for accuracy.",
      config: {
        temperature: 0.7,
      }
    });
    const latency = performance.now() - start;
    return { text: response.text.trim(), latency };
  } catch (error) {
    console.error("CRE Explanation API Error:", error);
    return { text: "Explanation unavailable.", latency: 0 };
  }
}
