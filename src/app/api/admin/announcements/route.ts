export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/adminAuth'


export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    return NextResponse.json(announcements)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, priority } = await req.json()
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        priority: priority as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT',
      }
    })
    return NextResponse.json({ success: true, announcement })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// Edit announcement — admin only — body { id, title, content, priority }
// (Public LIVE ticker isi model/API se padhta hai, to changes wahan auto reflect honge)
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, title, content, priority } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
        priority: priority as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT',
      },
    })

    return NextResponse.json({ success: true, announcement })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// Delete announcement — admin only — ?id=
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.announcement.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}