'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Upload, Trash2, Image as ImageIcon,
  Check, Eye, EyeOff, Plus, Save
} from 'lucide-react'

interface Slide {
  id?: string
  image: string | null
  caption: string
  subtitle: string
  isVisible: boolean
  order: number
}

// Image compress
function compress(file: File, maxW = 1920, quality = 0.85): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width, h = img.height
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW }
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        c.getContext('2d')!.drawImage(img, 0, 0, w, h)
        res(c.toDataURL('image/jpeg', quality))
      }
      img.onerror = rej
      img.src = e.target?.result as string
    }
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}

export default function AdminSliderPage(): React.ReactElement {
  const [slides, setSlides]       = useState<Slide[]>([])
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [uploading, setUploading] = useState<number | null>(null)
  const fileRefs                  = useRef<Array<HTMLInputElement | null>>([])

  // Load slides from DB
  useEffect(() => {
    fetch('/api/slider')
      .then(r => r.json())
      .then((data: Slide[]) => {
        if (data?.length) setSlides(data)
      })
      .catch(() => {})
  }, [])

  // Add new empty slide
  const addSlide = () => {
    setSlides(prev => [...prev, {
      image: null,
      caption: '',
      subtitle: '',
      isVisible: true,
      order: prev.length,
    }])
  }

  // Upload image
  const handleFile = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(idx)
    try {
      const img = await compress(file)
      setSlides(prev => prev.map((s, i) => i === idx ? { ...s, image: img } : s))
    } catch { alert('Photo upload failed.') }
    finally { setUploading(null) }
  }

  // Toggle visibility
  const toggleVisible = (idx: number) => {
    setSlides(prev => prev.map((s, i) => i === idx ? { ...s, isVisible: !s.isVisible } : s))
  }

  // Delete slide
  const deleteSlide = async (idx: number) => {
    const slide = slides[idx]
    if (slide.id) {
      await fetch(`/api/slider/${slide.id}`, { method: 'DELETE' })
    }
    setSlides(prev => prev.filter((_, i) => i !== idx))
  }

  // Update text
  const setText = (idx: number, field: 'caption' | 'subtitle', val: string) => {
    setSlides(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s))
  }

  // Save all
  const saveAll = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slides.map((s, i) => ({ ...s, order: i }))),
      })
      if (res.ok) {
        // Refresh from DB
        const updated = await fetch('/api/slider').then(r => r.json())
        setSlides(updated)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const d = await res.json()
        alert(d.error || 'Save failed')
      }
    } catch { alert('Server error.') }
    finally { setSaving(false) }
  }

  const visibleCount = slides.filter(s => s.isVisible).length

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Back */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Admin Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <ImageIcon size={22} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-slate-900">Slider Manager</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {visibleCount} / {slides.length} slides visible
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="btn-outline text-sm flex items-center gap-2">
              <Eye size={15} /> Live Preview
            </Link>
            <button type="button" onClick={addSlide}
              className="btn-outline text-sm flex items-center gap-2">
              <Plus size={15} /> New Slide
            </button>
            <button type="button" onClick={saveAll} disabled={saving}
              className="btn-primary text-sm flex items-center gap-2 px-6"
              style={saved ? { background: 'rgba(34,197,94,0.85)' } : {}}>
              {saved ? <><Check size={15}/> Saved!</> : saving ? <>Saving...</> : <><Save size={15}/> Save All</>}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-xl p-4 mb-6 flex items-center gap-3 text-sm"
          style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: 'var(--text-secondary)' }}>
          <span className="text-cyan-400 text-lg">ℹ️</span>
          <p>
            Upload photos → use the <strong className="text-cyan-400">Eye icon</strong> to show/hide →
            press <strong className="text-cyan-400"> Save All</strong>
          </p>
        </div>

        {/* Slides grid */}
        {slides.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <ImageIcon size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No slides yet</p>
            <button type="button" onClick={addSlide} className="btn-primary text-sm flex items-center gap-2 mx-auto">
              <Plus size={15} /> Add First Slide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {slides.map((slide, idx) => (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden transition-all"
                style={{
                  border: slide.isVisible
                    ? '1px solid rgba(34,211,238,0.3)'
                    : '1px solid rgba(255,255,255,0.06)',
                  opacity: slide.isVisible ? 1 : 0.55,
                }}>

                {/* Slide header */}
                <div className="px-4 py-2.5 flex items-center justify-between"
                  style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    Slide {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Visibility toggle */}
                    <button type="button" onClick={() => toggleVisible(idx)}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all"
                      style={{
                        background: slide.isVisible ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.06)',
                        color: slide.isVisible ? '#22d3ee' : 'rgba(255,255,255,0.4)',
                        border: `1px solid ${slide.isVisible ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      }}>
                      {slide.isVisible ? <><Eye size={12}/> Visible</> : <><EyeOff size={12}/> Hidden</>}
                    </button>
                    {/* Delete */}
                    <button type="button" onClick={() => deleteSlide(idx)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20"
                      style={{ color: 'rgba(239,68,68,0.7)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Image preview */}
                <div className="relative overflow-hidden cursor-pointer" style={{ height: '160px' }}
                  onClick={() => !slide.image && fileRefs.current[idx]?.click()}>
                  {uploading === idx ? (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: 'rgba(34,211,238,0.05)' }}>
                      <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : slide.image ? (
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <ImageIcon size={28} className="text-slate-300" />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Click to upload a photo
                      </span>
                    </div>
                  )}

                  {/* Upload overlay on existing image */}
                  {slide.image && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <button type="button" onClick={(e) => { e.stopPropagation(); fileRefs.current[idx]?.click() }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                        style={{ background: 'rgba(34,211,238,0.8)' }}>
                        <Upload size={12} /> Change Photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div className="p-4 flex flex-col gap-2.5">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Heading</label>
                    <input type="text" value={slide.caption}
                      onChange={e => setText(idx, 'caption', e.target.value)}
                      placeholder="Slide heading..."
                      className="w-full text-xs rounded-lg px-3 py-2 outline-none"
                      style={{ background: '#f8faff', border: '1px solid rgba(37,99,235,0.2)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Sub Text</label>
                    <input type="text" value={slide.subtitle}
                      onChange={e => setText(idx, 'subtitle', e.target.value)}
                      placeholder="Sub text..."
                      className="w-full text-xs rounded-lg px-3 py-2 outline-none"
                      style={{ background: '#f8faff', border: '1px solid rgba(37,99,235,0.2)', color: 'var(--text-secondary)' }}
                    />
                  </div>

                  <button type="button" onClick={() => fileRefs.current[idx]?.click()}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium mt-1"
                    style={{ background: 'rgba(34,211,238,0.10)', border: '1px solid rgba(34,211,238,0.25)', color: '#67e8f9' }}>
                    <Upload size={12} />
                    {slide.image ? 'Change Photo' : 'Upload Photo'}
                  </button>

                  <input type="file" accept="image/*" className="hidden"
                    ref={el => { fileRefs.current[idx] = el }}
                    onChange={e => handleFile(idx, e)}
                  />
                </div>
              </div>
            ))}

            {/* Add slide card */}
            <div className="glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-3 transition-all hover:border-cyan-400/40"
              style={{ border: '2px dashed rgba(255,255,255,0.1)', minHeight: '320px' }}
              onClick={addSlide}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                <Plus size={22} className="text-cyan-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Add New Slide
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(2,6,23,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
        <div>
          <p className="text-sm font-medium text-white">
            {visibleCount} slide{visibleCount !== 1 ? 's' : ''} visible
            <span className="ml-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              (total: {slides.length})
            </span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Changes go live on the home page after you save
          </p>
        </div>
        <button type="button" onClick={saveAll} disabled={saving}
          className="btn-primary flex items-center gap-2 px-10"
          style={saved ? { background: 'rgba(34,197,94,0.85)' } : {}}>
          {saved ? <><Check size={16}/> All Saved!</> : saving ? <>Saving...</> : <><Save size={16}/> Save All Changes</>}
        </button>
      </div>
    </div>
  )
}
