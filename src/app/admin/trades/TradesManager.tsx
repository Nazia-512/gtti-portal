'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Images, Upload, Trash2, RefreshCw } from 'lucide-react'

export type TradeRow = {
  id: string
  imageUrl: string
  alt: string | null
  order: number
}

export default function TradesManager({ initialTrades }: { initialTrades: TradeRow[] }) {
  const [trades, setTrades] = useState<TradeRow[]>(initialTrades)
  const [file, setFile] = useState<File | null>(null)
  const [alt, setAlt] = useState('')
  const [order, setOrder] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const refresh = async () => {
    const res = await fetch('/api/trades')
    const data = await res.json()
    if (data.trades) {
      setTrades(
        data.trades.map((t: any): TradeRow => ({
          id: t.id,
          imageUrl: t.imageUrl,
          alt: t.alt ?? null,
          order: t.order,
        }))
      )
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!file) {
      setError('Please select an image.')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt', alt.trim())
      if (order.trim() !== '') fd.append('order', order.trim())

      const res = await fetch('/api/trades', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Upload failed.')
        return
      }
      setFile(null)
      setAlt('')
      setOrder('')
      const input = document.getElementById('trade-file') as HTMLInputElement | null
      if (input) input.value = ''
      await refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return
    setBusyId(id)
    try {
      const res = await fetch(`/api/trades/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTrades((prev) => prev.filter((t) => t.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Delete failed.')
      }
    } catch {
      alert('Server error.')
    } finally {
      setBusyId(null)
    }
  }

  const handleReplace = async (id: string, newFile: File) => {
    setBusyId(id)
    try {
      const fd = new FormData()
      fd.append('file', newFile)
      const res = await fetch(`/api/trades/${id}`, { method: 'PUT', body: fd })
      if (res.ok) {
        await refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Replace failed.')
      }
    } catch {
      alert('Server error.')
    } finally {
      setBusyId(null)
    }
  }

  const handleOrderSave = async (id: string, value: string) => {
    if (value.trim() === '') return
    setBusyId(id)
    try {
      const fd = new FormData()
      fd.append('order', value.trim())
      const res = await fetch(`/api/trades/${id}`, { method: 'PUT', body: fd })
      if (res.ok) {
        await refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Order update failed.')
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400/20 to-pink-600/20 border border-rose-400/30 flex items-center justify-center">
            <Images size={24} className="text-rose-500" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Manage Trades</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Image only — upload a Canva card (title + details baked in)
            </p>
          </div>
        </div>

        {/* Upload form */}
        <form onSubmit={handleUpload} className="glass-card rounded-2xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Trade Image *</label>
              <input id="trade-file" type="file" accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="input-field" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Order (optional)</label>
              <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="auto" className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Name / Alt (optional — for identification)</label>
            <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Computer Technology" className="input-field" />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary justify-center py-3 disabled:opacity-50">
            {loading ? <>Uploading...</> : <><Upload size={16} /> Upload Trade</>}
          </button>
        </form>

        {/* Trades grid */}
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Images size={18} className="text-rose-500" /> Trades ({trades.length})
        </h2>

        {trades.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Images size={48} className="mx-auto mb-4 opacity-20 text-rose-500" />
            <p style={{ color: 'var(--text-muted)' }}>No trades uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trades.map((t) => (
              <div key={t.id} className="glass-card rounded-2xl p-4 flex flex-col">
                <div className="rounded-xl bg-slate-100 overflow-hidden aspect-[4/5] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.imageUrl} alt={t.alt ?? 'Trade'} className="w-full h-full object-contain" />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">{t.alt || 'Untitled'}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <input
                      type="number"
                      defaultValue={t.order}
                      onBlur={(e) => { if (Number(e.target.value) !== t.order) handleOrderSave(t.id, e.target.value) }}
                      className="w-14 text-xs rounded-lg border px-2 py-1"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                      aria-label="Order"
                      title="Order — change it, then click outside"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <label className={`btn-outline text-xs py-1.5 px-3 inline-flex cursor-pointer ${busyId === t.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <RefreshCw size={13} /> Replace
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleReplace(t.id, f); e.target.value = '' }} />
                  </label>
                  <button onClick={() => handleDelete(t.id)} disabled={busyId === t.id}
                    className="btn-outline text-xs py-1.5 px-3 inline-flex hover:border-red-400 hover:text-red-500 disabled:opacity-50">
                    <Trash2 size={13} /> {busyId === t.id ? '...' : 'Delete'}
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
