import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function formatAIResponse(text: string): string {
  return text
    // Remove markdown bold/italic markers
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    // Remove markdown headers
    .replace(/#{1,6}\s/g, '')
    // Convert markdown lists to proper format
    .replace(/^\s*[-*]\s/gm, '• ')
    // Remove code block markers
    .replace(/```[\s\S]*?```/g, '')
    // Remove excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token.value);
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a professional task management and productivity AI assistant. 
      Provide clear, concise, and practical advice for the following request.
      Focus on actionable steps and professional recommendations.
      Keep responses friendly but professional, and avoid using markdown formatting.
      
      User request: ${message}
      
      Response guidelines:
      - Use natural language without markdown
      - Keep paragraphs short and focused
      - Use bullet points for lists (with • symbol)
      - Maintain a professional tone
      - Be concise and direct
      - Focus on practical, actionable advice
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const formattedResponse = formatAIResponse(response.text());

    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
} 