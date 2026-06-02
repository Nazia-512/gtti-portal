export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { getAdminUser } from '@/lib/adminAuth'

type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
}

// POST — admin only: image upload to Cloudinary (gtti-trades) + Trade record save
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser(req.cookies.get('auth-token')?.value)
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string | null)?.trim() || null
    const orderRaw = formData.get('order') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Image file zaroori hai.' }, { status: 400 })
    }

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

    // order: agar diya gaya to wahi, warna sab se akhri ke baad
    let order: number
    if (orderRaw && orderRaw.trim() !== '') {
      order = parseInt(orderRaw, 10)
    } else {
      const last = await prisma.trade.findFirst({ orderBy: { order: 'desc' } })
      order = last ? last.order + 1 : 1
    }

    const trade = await prisma.trade.create({
      data: {
        imageUrl: uploaded.secure_url,
        cloudinaryPublicId: uploaded.public_id,
        alt,
        order,
      },
    })

    return NextResponse.json({ success: true, trade }, { status: 201 })
  } catch (error) {
    console.error('Trade upload error:', error)
    return NextResponse.json({ error: 'Trade upload nahi ho saka.' }, { status: 500 })
  }
}

// GET — public: saare trades order ke hisaab se (phir newest)
export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ trades })
  } catch (error) {
    console.error('Trade fetch error:', error)
    return NextResponse.json({ trades: [] }, { status: 200 })
  }
}
