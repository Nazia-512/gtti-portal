export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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