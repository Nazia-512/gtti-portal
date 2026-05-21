import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { cvData } = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found.' }, { status: 500 })
    }
    const prompt = `You are an expert resume writer. Create a professional ATS-optimized CV for a GTTI D.G. Khan student. Student info: ${JSON.stringify(cvData)}. Write complete CV with sections: Contact, Objective, Education, Skills, Projects. Use ======= dividers. Output CV text only.`
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await response.json()
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }
    const cv = data.content?.[0]?.text || 'Failed to generate CV.'
    return NextResponse.json({ cv })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}