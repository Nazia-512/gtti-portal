'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Image } from 'lucide-react'

export default function SliderAdminPage() {
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', subtitle: '', order: '0' })
  const [photo, setPhoto] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch('/api/admin/slider')
      .then(r => r.json())
      .then(d => { setSlides(d.slides || []); setLoading(false) })
  }, [])

  const handleAdd = async () => {
    if (!form.title || !photo) { alert('Title aur image required hai!'); return }
    setSaving(true)
    const res = await fetch('/api/admin/slider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, image: photo, order: parseInt(form.order) })
    })
    const data = await res.json()
    if (data.success) {
      setSlides(prev => [...prev, data.slide])
      setForm({ title: '', subtitle: '', order: '0' })
      setPhoto('')
      setSuccess('Slide add ho gaya!')
      setTimeout(() => setSuccess(''), 2000)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete karna chahte hain?')) return
    await fetch(`/api/admin/slider?id=${id}`, { method: 'DELETE' })
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
            <Image size={24} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Slider Images</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Homepage slider manage karo</p>
          </div>
        </div>

        {/* Add Form */}
        <div className="glass-card rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="font-semibold text-white">New Slide Add Karo</h2>

          {/* Photo Upload */}
          <div className="flex items-center gap-4">
            {photo ? (
              <img src={photo} alt="Slide" className="w-32 h-20 rounded-xl object-cover border border-cyan-400/30" />
            ) : (
              <div className="w-32 h-20 rounded-xl bg-white/5 border-2 border-dashed border-cyan-400/30 flex items-center justify-center">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Image</span>
              </div>
            )}
            <div>
              <input type="file" accept="image/*" id="slide-upload" className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = () => setPhoto(reader.result as string)
                    reader.readAsDataURL(file)
                  }
                }} />
              <label htmlFor="slide-upload" className="btn-outline text-sm cursor-pointer">
                Upload Image
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Title *</label>
              <input type="text" placeholder="Slide title..."
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Subtitle</label>
              <input type="text" placeholder="Subtitle..."
                value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          {success && <div className="text-green-400 text-xs p-2 rounded-lg bg-green-400/10">{success}</div>}

          <button onClick={handleAdd} disabled={saving}
            className="btn-primary text-sm disabled:opacity-50">
            <Plus size={16} /> {saving ? 'Adding...' : 'Add Slide'}
          </button>
        </div>

        {/* Slides List */}
        <div className="space-y-4">
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : slides.length === 0 ? (
            <div className="text-center py-10 glass-card rounded-2xl">
              <p style={{ color: 'var(--text-muted)' }}>Koi slide nahi hai — upar se add karo!</p>
            </div>
          ) : (
            slides.map(slide => (
              <div key={slide.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <img src={slide.image} alt={slide.title}
                  className="w-24 h-16 rounded-xl object-cover border border-cyan-400/20 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-white">{slide.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{slide.subtitle}</p>
                </div>
                <button onClick={() => handleDelete(slide.id)}
                  className="btn-outline text-sm hover:border-red-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}