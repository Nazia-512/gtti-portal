'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, BookOpen, Upload, Trash2, FileText, Image as ImageIcon,
  Video, Presentation, ExternalLink, Plus,
} from 'lucide-react'

export type LessonRow = {
  id: string
  title: string
  description: string | null
  fileUrl: string
  fileType: string
  fileName: string
  createdAt: string
}

function typeIcon(type: string) {
  switch (type) {
    case 'image': return <ImageIcon size={18} className="text-green-500" />
    case 'video': return <Video size={18} className="text-purple-500" />
    case 'ppt': return <Presentation size={18} className="text-orange-500" />
    default: return <FileText size={18} className="text-red-500" />
  }
}

export default function LessonsManager({ initialLessons }: { initialLessons: LessonRow[] }) {
  const [lessons, setLessons] = useState<LessonRow[]>(initialLessons)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !file) {
      setError('Title and file are both required.')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      fd.append('description', description.trim())
      fd.append('file', file)

      const res = await fetch('/api/lessons', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Upload failed.')
        return
      }

      // Nayi lesson list ke upar add kar do
      const l = data.lesson
      setLessons((prev) => [
        {
          id: l.id,
          title: l.title,
          description: l.description,
          fileUrl: l.fileUrl,
          fileType: l.fileType,
          fileName: l.fileName,
          createdAt: l.createdAt,
        },
        ...prev,
      ])
      setTitle('')
      setDescription('')
      setFile(null)
      // file input reset
      const input = document.getElementById('lesson-file') as HTMLInputElement | null
      if (input) input.value = ''
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLessons((prev) => prev.filter((l) => l.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Delete failed.')
      }
    } catch {
      alert('Server error.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-600/20 border border-blue-400/30 flex items-center justify-center">
            <BookOpen size={24} className="text-blue-500" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Manage Lessons</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Upload lesson files (PDF, PPT, image, video)
            </p>
          </div>
        </div>

        {/* Upload form */}
        <form onSubmit={handleUpload} className="glass-card rounded-2xl p-6 mb-8 space-y-4">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title"
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short description..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              File * (PDF / PPT / Image / Video)
            </label>
            <input
              id="lesson-file"
              type="file"
              accept=".pdf,.ppt,.pptx,image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="input-field"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary justify-center py-3 disabled:opacity-50"
          >
            {loading ? <>Uploading...</> : <><Upload size={16} /> Upload Lesson</>}
          </button>
        </form>

        {/* Lessons list */}
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-500" /> Uploaded Lessons ({lessons.length})
        </h2>

        {lessons.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20 text-blue-500" />
            <p style={{ color: 'var(--text-muted)' }}>No lessons uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((l) => (
              <div
                key={l.id}
                className="glass-card rounded-2xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                    {typeIcon(l.fileType)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{l.title}</p>
                    {l.description && (
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {l.description}
                      </p>
                    )}
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <span className="uppercase">{l.fileType}</span> · {l.fileName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                  <a
                    href={l.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline text-xs py-1.5 px-3 inline-flex"
                  >
                    <ExternalLink size={13} /> Open
                  </a>
                  <button
                    onClick={() => handleDelete(l.id)}
                    disabled={deletingId === l.id}
                    className="btn-outline text-xs py-1.5 px-3 inline-flex hover:border-red-400 hover:text-red-500 disabled:opacity-50"
                  >
                    <Trash2 size={13} /> {deletingId === l.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
