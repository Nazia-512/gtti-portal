export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Auth: sirf logged-in student hi CV generate kar sake.
    // ('auth-token' cookie -> Session lookup -> expiry check) — wahi tareeqa
    // jo career-test route mein hai. Yeh isliye taake koi seedha API hit
    // karke limited Groq key waste na kar sake.
    const token = req.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await prisma.session.findUnique({ where: { token } })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cvData } = await req.json()

    const prompt = `You are a professional CV writer. Create a complete CV using ONLY the data below.

STUDENT DATA:
Name: ${cvData.name}
Email: ${cvData.email}
Phone: ${cvData.phone}
City: ${cvData.city}
Objective: ${cvData.objective || 'Generate a professional objective based on their field'}
Education: ${cvData.education.map((e: {degree:string, institution:string, year:string, grade:string}) => 
  `${e.degree} from ${e.institution}, Year: ${e.year}, Grade: ${e.grade}`).join(', ')}
Skills: ${cvData.skills.length > 0 ? cvData.skills.join(', ') : 'Suggest 6 relevant skills based on their field'}
Experience: ${cvData.experience && cvData.experience.length > 0 ? 
  cvData.experience.map((e: {title:string, company:string, duration:string}) => 
  `${e.title} at ${e.company} (${e.duration})`).join(', ') : 'None'}
Projects: ${cvData.projects.length > 0 ? cvData.projects.map((p: {name:string, desc:string, tech:string}) => 
  `${p.name}: ${p.desc}, Tech: ${p.tech}`).join(', ') : 'None'}

Write the CV using EXACTLY this format with these exact separator lines:

NAME: ${cvData.name}
EMAIL: ${cvData.email} | PHONE: ${cvData.phone} | CITY: ${cvData.city}

--------------------------------------------------
CAREER OBJECTIVE
--------------------------------------------------
Write 2-3 sentences professional objective here based on their field.

--------------------------------------------------
EDUCATION
--------------------------------------------------
Write education details here.

--------------------------------------------------
SKILLS
--------------------------------------------------
Write 6-8 relevant skills here, one per line.
--------------------------------------------------
EXPERIENCE
--------------------------------------------------
Write experience details here or "No experience listed" if none.
--------------------------------------------------
PROJECTS
--------------------------------------------------
Write projects here or write "No projects listed" if none.

--------------------------------------------------
REFERENCES
--------------------------------------------------
Available upon request

Write ONLY the CV content above. No extra text, no extra symbols, no markdown.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7
      }),
    })

    const data = await response.json()
    const cv = data.choices?.[0]?.message?.content || 'Failed to generate CV.'
    return NextResponse.json({ cv })

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}