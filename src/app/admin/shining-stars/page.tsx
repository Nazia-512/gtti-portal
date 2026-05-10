'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function ShiningStarsAdminPage() {
  const [students, setStudents] = useState<any[]>([])
  const [shiningStars, setShiningStars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Student model data
    fetch('/api/admin/shining-stars')
      .then(r => r.json())
      .then(d => setStudents(d.students || []))

    // ShinningStar model data
    fetch('/api/admin/shining-stars/list')
      .then(r => r.json())
      .then(d => { setShiningStars(d.stars || []); setLoading(false) })
  }, [])

  const deleteStar = async (id: string) => {
    if (!confirm('Delete karna chahte hain?')) return
    await fetch(`/api/admin/shining-stars/list?id=${id}`, { method: 'DELETE' })
    setShiningStars(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center">
              <Star size={24} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">Shining Stars</h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Manage top performers</p>
            </div>
          </div>
          <Link href="/admin/shining-stars/new" className="btn-gold text-sm flex items-center gap-2">
            <Plus size={15} /> Add Shining Star
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading...</div>
        ) : shiningStars.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <Star size={48} className="mx-auto mb-4 opacity-20 text-yellow-400" />
            <p style={{ color: 'var(--text-muted)' }}>Koi Shining Star nahi hai</p>
            <Link href="/admin/shining-stars/new" className="btn-gold mt-4 text-sm inline-flex items-center gap-2">
              <Plus size={15} /> Pehla Shining Star Add Karo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {shiningStars.map((star: any) => (
              <div key={star.id} className="glass-card rounded-2xl p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {star.photo ? (
                    <img src={star.photo} alt={star.name}
                      className="w-12 h-12 rounded-xl object-cover border border-yellow-400/30" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/10 to-amber-600/10 border border-yellow-400/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-400">
                        {star.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{star.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {star.department} | {star.batch}
                    </p>
                    {star.position && star.company && (
                      <p className="text-xs text-yellow-400 mt-1">⭐ {star.position} at {star.company}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteStar(star.id)}
                  className="btn-outline text-sm flex items-center gap-2 hover:border-red-400 hover:text-red-400">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}