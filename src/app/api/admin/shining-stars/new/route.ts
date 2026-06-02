export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { name, photo, department, batch, position, company, story, skills, rollNumber, gpa } = await req.json()

    const star = await prisma.shinningStar.create({
      data: {
        name,
        photo: photo || null,
        department,
        batch,
        position: position || null,
        company: company || null,
        story: story || null,
        skills: skills || '',
        rollNumber: rollNumber || null,
        gpa: gpa || null,
      }
    })

    return NextResponse.json({ success: true, star })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}