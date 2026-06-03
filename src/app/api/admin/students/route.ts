export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/adminAuth'

// Saare students (User + Student) — sirf admin ke liye
export async function GET() {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })
  return NextResponse.json({ students })
}

// Approve / un-approve — body { userId, approved }
export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { userId, approved } = await req.json()
    if (!userId || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'userId and approved are required' }, { status: 400 })
    }

    await prisma.user.update({ where: { id: userId }, data: { approved } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// Edit student — body { studentId, userId, name, rollNumber, department, batch, phone }
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { studentId, userId, name, rollNumber, department, batch, phone } = await req.json()
    if (!studentId) return NextResponse.json({ error: 'studentId is required' }, { status: 400 })

    await prisma.student.update({
      where: { id: studentId },
      data: {
        rollNumber,
        department,
        batch,
        phone: phone || null,
      },
    })

    if (userId && name) {
      await prisma.user.update({ where: { id: userId }, data: { name } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// Delete student (reject pending bhi isi se) — ?studentId=&userId=
// User, uske sessions aur Student record sab hata do
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const userId = searchParams.get('userId')
    if (!studentId) return NextResponse.json({ error: 'studentId is required' }, { status: 400 })

    if (userId) await prisma.session.deleteMany({ where: { userId } })
    await prisma.student.delete({ where: { id: studentId } })
    if (userId) await prisma.user.delete({ where: { id: userId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
