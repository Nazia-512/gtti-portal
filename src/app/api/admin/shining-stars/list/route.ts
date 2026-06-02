export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAdminUser } from '@/lib/adminAuth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const stars = await prisma.shinningStar.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ stars })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    await prisma.shinningStar.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Admin-only — wahi auth helper jo baaki admin routes use karte hain
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, name, photo, department, batch, position, company, story, skills, rollNumber, gpa } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const star = await prisma.shinningStar.update({
      where: { id },
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
        gpa: gpa === '' || gpa === undefined || gpa === null ? null : Number(gpa),
      },
    })

    return NextResponse.json({ success: true, star })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}