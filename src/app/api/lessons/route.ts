export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cloudinary } from '@/lib/cloudinary'
import { getAdminUser, getSessionUserId } from '@/lib/adminAuth'

// File extension se fileType nikaalo ('pdf' | 'ppt' | 'image' | 'video')
function detectFileType(name: string, mime: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf' || mime === 'application/pdf') return 'pdf'
  if (['ppt', 'pptx'].includes(ext)) return 'ppt'
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext) || mime.startsWith('video/')) return 'video'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) || mime.startsWith('image/')) return 'image'
  return 'pdf'
}

type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
}

// POST — admin only: file + title + description upload to Cloudinary + save Lesson
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser(req.cookies.get('auth-token')?.value)
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = (formData.get('title') as string | null)?.trim()
    const description = (formData.get('description') as string | null)?.trim() || null

    if (!file || !title) {
      return NextResponse.json(
        { error: 'Title aur file dono zaroori hain.' },
        { status: 400 }
      )
    }

    const fileType = detectFileType(file.name, file.type)

    // File ko buffer mein convert karke Cloudinary par upload karo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploaded = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'auto', folder: 'gtti-lessons' },
          (error, result) => {
            if (error || !result) reject(error ?? new Error('Upload failed'))
            else resolve(result as CloudinaryUploadResult)
          }
        )
        .end(buffer)
    })

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        fileUrl: uploaded.secure_url,
        fileType,
        fileName: file.name,
        cloudinaryPublicId: uploaded.public_id,
        uploadedBy: admin.id,
      },
    })

    return NextResponse.json({ success: true, lesson }, { status: 201 })
  } catch (error) {
    console.error('Lesson upload error:', error)
    return NextResponse.json(
      { error: 'Lesson upload nahi ho saka.' },
      { status: 500 }
    )
  }
}

// GET — koi bhi logged-in user: saare lessons, newest first
export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUserId(req.cookies.get('auth-token')?.value)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Lesson fetch error:', error)
    return NextResponse.json(
      { error: 'Lessons load nahi ho sake.' },
      { status: 500 }
    )
  }
}
