'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ClipboardList, Briefcase, Plane, GraduationCap,
  MapPin, FileText, Eye,
} from 'lucide-react'

export type CareerTestRow = {
  id: string
  studentName: string
  rollNo: string
  trade: string
  year: string
  recommendedPathway: string
  testDate: string
}

// recommendedPathway keys -> labels (careerScoring se match karte hain)
const PATHWAY_LABELS: Record<string, string> = {
  entrepreneurship: 'Entrepreneurship / Self Employment',
  foreignJob: 'Foreign Job',
  higherEducation: 'Higher Education',
  localJob: 'Local Job Placement',
}

// Summary cards ke liye order + icon + color
const PATHWAY_CARDS: {
  key: string
  label: string
  icon: typeof Briefcase
  color: string
}[] = [
  { key: 'entrepreneurship', label: 'Entrepreneurship', icon: Briefcase, color: 'text-purple-500' },
  { key: 'foreignJob', label: 'Foreign Job', icon: Plane, color: 'text-cyan-500' },
  { key: 'higherEducation', label: 'Higher Education', icon: GraduationCap, color: 'text-green-500' },
  { key: 'localJob', label: 'Local Job Placement', icon: MapPin, color: 'text-orange-500' },
]

function labelFor(key: string) {
  return PATHWAY_LABELS[key] ?? key
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function CareerTestsView({ rows }: { rows: CareerTestRow[] }) {
  const [tradeFilter, setTradeFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  // Dropdown options — saare records se unique trades/years
  const trades = useMemo(
    () => Array.from(new Set(rows.map((r) => r.trade).filter(Boolean))).sort(),
    [rows]
  )
  const years = useMemo(
    () => Array.from(new Set(rows.map((r) => r.year).filter(Boolean))).sort(),
    [rows]
  )

  // Filter lagao — table aur counts dono isi par based hain
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!tradeFilter || r.trade === tradeFilter) &&
          (!yearFilter || r.year === yearFilter)
      ),
    [rows, tradeFilter, yearFilter]
  )

  // Category-wise counts (filtered set par)
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const r of filtered) {
      c[r.recommendedPathway] = (c[r.recommendedPathway] ?? 0) + 1
    }
    return c
  }, [filtered])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400/20 to-indigo-600/20 border border-purple-400/30 flex items-center justify-center">
            <ClipboardList size={24} className="text-purple-500" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900">Career Test Reports</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Career Pathway test results and summary for students
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Tests</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/10">
                <FileText size={18} className="text-blue-500" />
              </div>
            </div>
            <p className="font-display font-bold text-3xl text-slate-900">{filtered.length}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Filled by students</p>
          </div>

          {/* Per-pathway */}
          {PATHWAY_CARDS.map((c) => (
            <div key={c.key} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-500/10">
                  <c.icon size={18} className={c.color} />
                </div>
              </div>
              <p className="font-display font-bold text-3xl text-slate-900">{counts[c.key] ?? 0}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Recommended</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Filter by Trade
              </label>
              <select
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Trades</option>
                {trades.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Filter by Year
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl p-2 sm:p-4 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList size={48} className="mx-auto mb-4 opacity-20 text-purple-500" />
              <p style={{ color: 'var(--text-muted)' }}>No career test records found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['Student Name', 'Roll No', 'Trade', 'Year', 'Recommended Pathway', 'Date', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left font-semibold px-3 py-3 whitespace-nowrap"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b last:border-0"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-3 py-3 font-medium text-slate-900 whitespace-nowrap">{r.studentName}</td>
                    <td className="px-3 py-3 font-mono whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{r.rollNo}</td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{r.trade}</td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{r.year}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="badge badge-cyan">{labelFor(r.recommendedPathway)}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{formatDate(r.testDate)}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <Link
                        href={`/student/test/result?id=${r.id}`}
                        className="btn-outline text-xs py-1.5 px-3 inline-flex"
                      >
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
