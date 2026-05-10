import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const systemPrompt = `You are an intelligent academic and career assistant for GTTI D.G. Khan, Punjab, Pakistan. 
You help students with:
- Career guidance for all trades (Welding, Electrician, HVAC, Computer, IT, Civil, Mechanical etc)
- Academic advice and study tips
- Job market information in Pakistan
- CV and interview tips
- Course recommendations
- Scholarship information

Rules:
- If student writes in Urdu, ALWAYS respond in Urdu
- If student writes in English, respond in English
- Always be encouraging and supportive
- Give specific, practical advice
- Keep responses concise and helpful`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Could not process request.'
    return NextResponse.json({ reply })

  } catch (error) {
    return NextResponse.json({ reply: `Error: ${String(error)}` })
  }
}