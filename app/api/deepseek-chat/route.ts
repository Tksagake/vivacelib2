import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = "https://api.deepseek.com/chat/completions";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch from DeepSeek API" }, { status: response.status });
  }

  const data = await response.json();
  const message = data.choices[0]?.message?.content || "No response from DeepSeek.";
  return NextResponse.json({ message });
}
