export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { getAdminUser } from '@/lib/adminAuth'

// Cloudinary delete ke liye resource_type chahiye — fileType se map karo
function resourceTypeFor(fileType: string): 'image' | 'video' | 'raw' {
  if (fileType === 'image') return 'image'
  if (fileType === 'video') return 'video'
  // pdf / ppt etc. 'auto' upload par raw ya image ho sakte hain;
  // pdf/ppt ko raw treat karte hain
  return 'raw'
}

// DELETE — admin only: Cloudinary asset + Lesson record dono hata do
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser(req.cookies.get('auth-token')?.value)
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: params.id } })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Pehle Cloudinary se asset hatao (fail ho to bhi DB record hata denge)
    try {
      await cloudinary.uploader.destroy(lesson.cloudinaryPublicId, {
        resource_type: resourceTypeFor(lesson.fileType),
      })
    } catch (err) {
      console.error('Cloudinary delete error (continuing):', err)
    }

    await prisma.lesson.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lesson delete error:', error)
    return NextResponse.json(
      { error: 'Lesson delete failed.' },
      { status: 500 }
    )
  }
}
