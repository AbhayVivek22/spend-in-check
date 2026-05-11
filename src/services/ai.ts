import { GoogleGenAI } from "@google/genai";
import type { Expense } from "../types";
import { formatCurrency } from "../lib/utils";

export async function generateInsights(expenses: Expense[], userApiKey?: string): Promise<string> {
  // Try to use user provided key first, otherwise fallback to the environment one provided by AI Studio
  const apiKey = userApiKey || (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("No API key provided. Please enter your Gemini API key in the settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  if (expenses.length === 0) {
    return "You have no expenses recorded yet. Start adding some to get insights!";
  }

  // Calculate some basic stats to include in the prompt
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Create a simplified summary to avoid huge token loads if there are many expenses
  const categorySummary = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
I have an expense tracker app. Here is a summary of the user's spending data.
Total Spent: ${formatCurrency(totalSpent)} (in Indian Rupees - INR)

Breakdown by Category:
${Object.entries(categorySummary).map(([cat, amount]) => `- ${cat}: ${formatCurrency(amount)}`).join('\n')}

Recent transactions:
${expenses.slice(0, 15).map(e => `- ${e.date}: ${e.description} (${formatCurrency(e.amount)})`).join('\n')}

Please act as a financial advisor and provide 3 brief, punchy, and highly actionable insights or observations about these spending habits. Keep it supportive but realistic. Do not use Markdown headings, just bullet points. Keep it concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw new Error(error.message || "Failed to generate insights.");
  }
}
