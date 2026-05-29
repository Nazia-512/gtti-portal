export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { title, company, location, type, description, salary, deadline } = await req.json()

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type: type as 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT',
        description,
        salary: salary || null,
        deadline: deadline ? new Date(deadline) : null,
        requirements: '[]',
        postedBy: 'admin@gtti.edu.pk',
        isActive: true
      }
    })

    return NextResponse.json({ success: true, job })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ jobs })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}