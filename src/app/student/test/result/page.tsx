'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import CareerTestPrintable from '@/components/CareerTestPrintable'

type Scores = Record<string, number>

type CareerTest = {
  id: string
  studentName: string
  rollNo: string
  trade: string
  institute: string
  testDate: string
  sectionA: Record<string, string>
  sectionB: Record<string, string>
  scores: Scores
  recommendedPathway: string
}

const PATHWAY_LABELS: Record<string, string> = {
  entrepreneurship: 'Entrepreneurship / Self Employment',
  foreignJob: 'Foreign Job',
  higherEducation: 'Higher Education',
  localJob: 'Local Job Placement',
}

// Display order for the score breakdown
const PATHWAY_ORDER = [
  'entrepreneurship',
  'foreignJob',
  'higherEducation',
  'localJob',
]

function labelFor(key: string) {
  return PATHWAY_LABELS[key] ?? key
}

function ResultContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [data, setData] = useState<CareerTest | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setError('No test ID found.')
      setLoading(false)
      return
    }

    let active = true
    ;(async () => {
      try {
        const res = await fetch(`/api/career-test/${id}`)
        const json = await res.json()
        if (!active) return
        if (!res.ok) {
          setError(json.error || 'Could not load the result.')
        } else {
          setData(json.careerTest)
        }
      } catch {
        if (active) setError('Something went wrong! Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading result...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-red-600">
        {error || 'Result not found.'}
      </div>
    )
  }

  const scores = data.scores || {}
  const maxScore = Math.max(1, ...Object.values(scores))
  const date = new Date(data.testDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* Print-only official TEVTA form */}
      <CareerTestPrintable record={data} />

      {/* Screen version (print mein hidden) */}
      <div className="min-h-screen bg-gray-50 py-8 px-4 print:hidden">

      <div className="mx-auto max-w-2xl">
        <div className="print-area rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6 border-b border-gray-100 pb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Career Pathway Result
            </h1>
            <p className="mt-1 text-sm text-gray-500">GTTI Smart Portal</p>
          </div>

          {/* Student Info */}
          <div className="mb-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <InfoRow label="Name" value={data.studentName} />
            <InfoRow label="Roll No" value={data.rollNo} />
            <InfoRow label="Trade" value={data.trade} />
            <InfoRow label="Institute" value={data.institute} />
            <InfoRow label="Test Date" value={date} />
          </div>

          {/* Recommended Pathway */}
          <div className="mb-8 rounded-xl bg-blue-600 p-6 text-center text-white">
            <p className="text-xs uppercase tracking-wide text-blue-100">
              Recommended Pathway
            </p>
            <p className="mt-2 text-2xl font-bold">
              {labelFor(data.recommendedPathway)}
            </p>
          </div>

          {/* Score Breakdown */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Score Breakdown
            </h2>
            <div className="space-y-4">
              {PATHWAY_ORDER.filter((key) => key in scores).map((key) => {
                const value = scores[key]
                const pct = Math.round((value / maxScore) * 100)
                const isTop = key === data.recommendedPathway
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={
                          isTop
                            ? 'font-semibold text-blue-700'
                            : 'text-gray-700'
                        }
                      >
                        {labelFor(key)}
                      </span>
                      <span className="font-medium text-gray-600">{value}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${
                          isTop ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Actions (print mein hide) */}
        <div className="no-print mt-6 flex justify-center">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Download PDF
          </button>
        </div>
      </div>
      </div>
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}

export default function CareerTestResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          Loading result...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  )
}
