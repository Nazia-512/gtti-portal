export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { getAdminUser } from '@/lib/adminAuth'

type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
}

// PUT — admin only: image replace karo aur/ya order/alt update karo
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser(req.cookies.get('auth-token')?.value)
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const existing = await prisma.trade.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const orderRaw = formData.get('order') as string | null
    const alt = formData.get('alt') as string | null

    const data: { imageUrl?: string; cloudinaryPublicId?: string; order?: number; alt?: string | null } = {}

    // Nayi image upload (purani Cloudinary asset hatao agar maujood ho)
    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploaded = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: 'image', folder: 'gtti-trades' },
            (error, result) => {
              if (error || !result) reject(error ?? new Error('Upload failed'))
              else resolve(result as CloudinaryUploadResult)
            }
          )
          .end(buffer)
      })

      if (existing.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(existing.cloudinaryPublicId, { resource_type: 'image' })
        } catch (err) {
          console.error('Cloudinary delete error (continuing):', err)
        }
      }

      data.imageUrl = uploaded.secure_url
      data.cloudinaryPublicId = uploaded.public_id
    }

    if (orderRaw !== null && orderRaw.trim() !== '') {
      data.order = parseInt(orderRaw, 10)
    }
    if (alt !== null) {
      data.alt = alt.trim() || null
    }

    const trade = await prisma.trade.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, trade })
  } catch (error) {
    console.error('Trade update error:', error)
    return NextResponse.json({ error: 'Trade update nahi ho saka.' }, { status: 500 })
  }
}

// DELETE — admin only: Cloudinary asset + Trade record dono hatao
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser(req.cookies.get('auth-token')?.value)
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const trade = await prisma.trade.findUnique({ where: { id: params.id } })
    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    if (trade.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(trade.cloudinaryPublicId, { resource_type: 'image' })
      } catch (err) {
        console.error('Cloudinary delete error (continuing):', err)
      }
    }

    await prisma.trade.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Trade delete error:', error)
    return NextResponse.json({ error: 'Trade delete nahi ho saka.' }, { status: 500 })
  }
}
