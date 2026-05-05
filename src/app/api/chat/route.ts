import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const systemPrompt = `You are an intelligent academic and career assistant for GTTI D.G. Khan, Punjab, Pakistan. Help students with academics, career guidance, and job market info. If students write in Urdu, respond in Urdu. Always be encouraging.`
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ reply: 'API key not found in .env file.' })
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    })
    const data = await response.json()
    if (data.error) {
      return NextResponse.json({ reply: `AI Error: ${data.error.message}` })
    }
    const reply = data.content?.[0]?.text || 'Could not process request.'
    return NextResponse.json({ reply })
  } catch (error) {
    return NextResponse.json({ reply: `Error: ${String(error)}` })
  }
}