export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminUser } from '@/lib/adminAuth'

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

// Edit job — admin only — body { id, title, company, location, type, description, salary, deadline }
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, title, company, location, type, description, salary, deadline } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        company,
        location,
        type: type as 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT',
        description,
        salary: salary || null,
        deadline: deadline ? new Date(deadline) : null,
      },
    })

    return NextResponse.json({ success: true, job })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// Delete job — admin only — ?id=
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.job.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}