import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ students })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    const { studentId, isShinningStar, reason } = await req.json()

    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        isShinningStar: isShinningStar === 'true',
        starReason: reason || 'Top Performer'
      }
    })

    return NextResponse.json({ success: true, student })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}