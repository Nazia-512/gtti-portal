'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type SectionAValue = 'always' | 'sometimes' | 'rarely'
type SectionBValue = 'yes' | 'no' | 'notsure'

const SECTION_A_OPTIONS: { value: SectionAValue; label: string }[] = [
  { value: 'always', label: 'Always True' },
  { value: 'sometimes', label: 'Sometimes True' },
  { value: 'rarely', label: 'Rarely True' },
]

const SECTION_B_OPTIONS: { value: SectionBValue; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'notsure', label: 'Not Sure' },
]

type Statement = { key: string; en: string; ur: string }

const SECTION_A_STATEMENTS: Statement[] = [
  {
    key: 'A1',
    en: 'I stay calm and confident even under pressure.',
    ur: 'میں دباؤ کے باوجود پرسکون اور پراعتماد رہتا ہوں۔',
  },
  {
    key: 'A2',
    en: 'I like taking charge and leading others.',
    ur: 'مجھے قیادت کرنا اور دوسروں کی رہنمائی کرنا پسند ہے۔',
  },
  {
    key: 'A3',
    en: 'I enjoy solving problems creatively.',
    ur: 'مجھے تخلیقی طریقے سے مسائل حل کرنا اچھا لگتا ہے۔',
  },
  {
    key: 'A4',
    en: 'I adjust easily in new places or situations.',
    ur: 'میں نئے ماحول یا حالات میں جلدی ڈھل جاتا ہوں۔',
  },
  {
    key: 'A5',
    en: 'I prefer clear instructions and structure.',
    ur: 'مجھے واضح ہدایات اور ترتیب پسند ہے۔',
  },
  {
    key: 'A6',
    en: 'I am okay taking risks if the reward is worth it.',
    ur: 'اگر انعام مناسب ہو تو مجھے خطرہ مول لینا قابل قبول ہوتا ہے۔',
  },
  {
    key: 'A7',
    en: 'I love learning deeply about topics of interest.',
    ur: 'مجھے دلچسپی کے موضوعات میں گہرائی سے سیکھنا پسند ہے۔',
  },
  {
    key: 'A8',
    en: 'I enjoy working alone on tasks.',
    ur: 'مجھے تنہا کام کرنا اچھا لگتا ہے۔',
  },
  {
    key: 'A9',
    en: 'I work best in a team setting.',
    ur: 'میں ٹیم کے ساتھ کام کرنے میں بہتر نتائج دیتا ہوں۔',
  },
  {
    key: 'A10',
    en: "I'm comfortable speaking to strangers or large groups.",
    ur: 'میں اجنبی افراد یا بڑے گروپ سے بات کرنے میں خود کو آرام دہ محسوس کرتا ہوں۔',
  },
]

const SECTION_B_STATEMENTS: Statement[] = [
  {
    key: 'B1',
    en: 'I want to find a job in Pakistan after TEVTA.',
    ur: 'میں ٹیوٹا کے بعد پاکستان میں نوکری تلاش کرنا چاہتا ہوں۔',
  },
  {
    key: 'B2',
    en: 'I wish to work abroad someday.',
    ur: 'میں کسی دن بیرونِ ملک کام کرنا چاہتا ہوں۔',
  },
  {
    key: 'B3',
    en: 'I am interested in further studies after this program.',
    ur: 'میں اس پروگرام کے بعد مزید تعلیم حاصل کرنے میں دلچسپی رکھتا ہوں۔',
  },
  {
    key: 'B4',
    en: 'I would love to start my own business or be self-employed.',
    ur: 'میں اپنا کاروبار شروع کرنا یا خود روزگار اختیار کرنا چاہتا ہوں۔',
  },
  {
    key: 'B5',
    en: 'I want a job that gives me financial security soon.',
    ur: 'میں ایسی نوکری چاہتا ہوں جو جلد مالی تحفظ فراہم کرے۔',
  },
  {
    key: 'B6',
    en: "I want to build something of my own, even if it's risky.",
    ur: 'میں کچھ اپنا بنانا چاہتا ہوں، چاہے اس میں خطرہ ہی کیوں نہ ہو۔',
  },
  {
    key: 'B7',
    en: 'I want a career that lets me explore the world.',
    ur: 'میں ایسا کیریئر چاہتا ہوں جو مجھے دنیا گھومنے کا موقع دے۔',
  },
  {
    key: 'B8',
    en: 'I want to study more so I can achieve a higher position.',
    ur: 'میں مزید تعلیم حاصل کرنا چاہتا ہوں تاکہ بہتر مقام حاصل کر سکوں۔',
  },
]

const SECTION_A_KEYS = SECTION_A_STATEMENTS.map((s) => s.key)
const SECTION_B_KEYS = SECTION_B_STATEMENTS.map((s) => s.key)

export default function CareerTestPage() {
  const router = useRouter()

  const [studentName, setStudentName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [trade, setTrade] = useState('')
  const [institute, setInstitute] = useState('')
  const [year, setYear] = useState('')

  const [sectionA, setSectionA] = useState<Record<string, SectionAValue>>({})
  const [sectionB, setSectionB] = useState<Record<string, SectionBValue>>({})

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Agar logged-in user ka naam mil jaye to auto-fill, warna khaali rehne do
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) return
        const data = await res.json()
        if (active && data?.name) setStudentName(data.name)
      } catch {
        // ignore — field khaali rahega
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation: saare fields aur saare jawab zaroori
    if (
      !studentName.trim() ||
      !rollNo.trim() ||
      !trade.trim() ||
      !institute.trim() ||
      !year
    ) {
      setError('Please apni saari details bharein.')
      return
    }

    if (SECTION_A_KEYS.some((key) => !sectionA[key])) {
      setError('Please Section A ke saare statements ka jawab dein.')
      return
    }

    if (SECTION_B_KEYS.some((key) => !sectionB[key])) {
      setError('Please Section B ke saare statements ka jawab dein.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/career-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName.trim(),
          rollNo: rollNo.trim(),
          trade: trade.trim(),
          institute: institute.trim(),
          year,
          sectionA,
          sectionB,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Test submit nahi ho saka. Dobara koshish karein.')
        return
      }

      router.push(`/student/test/result?id=${data.id}`)
    } catch {
      setError('Kuch ghalat ho gaya! Dobara koshish karein.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Career Pathway Test
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Apni details bharein aur har statement ka imaandari se jawab dein.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Student Info */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Student Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Apna naam likhein"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Roll No
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Roll number"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Trade
                </label>
                <input
                  type="text"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Trade / department"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Institute
                </label>
                <input
                  type="text"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Institute ka naam"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section A */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">Section A</h2>
            <p className="mb-4 text-sm text-gray-600">
              Har statement ke liye choose karein: Always / Sometimes / Rarely
            </p>
            <div className="space-y-4">
              {SECTION_A_STATEMENTS.map((stmt, idx) => (
                <div
                  key={stmt.key}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {idx + 1}. {stmt.en}
                  </p>
                  <p
                    dir="rtl"
                    className="mb-3 text-xs text-gray-500"
                  >
                    {stmt.ur}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                    {SECTION_A_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                      >
                        <input
                          type="radio"
                          name={stmt.key}
                          value={opt.value}
                          checked={sectionA[stmt.key] === opt.value}
                          onChange={() =>
                            setSectionA((prev) => ({
                              ...prev,
                              [stmt.key]: opt.value,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section B */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">Section B</h2>
            <p className="mb-4 text-sm text-gray-600">
              Har statement ke liye choose karein: Yes / No / Not Sure
            </p>
            <div className="space-y-4">
              {SECTION_B_STATEMENTS.map((stmt, idx) => (
                <div
                  key={stmt.key}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {idx + 1}. {stmt.en}
                  </p>
                  <p
                    dir="rtl"
                    className="mb-3 text-xs text-gray-500"
                  >
                    {stmt.ur}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                    {SECTION_B_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                      >
                        <input
                          type="radio"
                          name={stmt.key}
                          value={opt.value}
                          checked={sectionB[stmt.key] === opt.value}
                          onChange={() =>
                            setSectionB((prev) => ({
                              ...prev,
                              [stmt.key]: opt.value,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Test'}
          </button>
        </form>
      </div>
    </div>
  )
}
