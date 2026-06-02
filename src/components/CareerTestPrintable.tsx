'use client'

type Statement = { key: string; en: string; ur: string }

export type PrintableRecord = {
  studentName: string
  rollNo: string
  trade: string
  institute: string
  testDate: string
  recommendedPathway: string
  sectionA: Record<string, string>
  sectionB: Record<string, string>
}

// Same statements as the test form (English + Urdu)
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

const SECTION_A_COLUMNS: { value: string; label: string }[] = [
  { value: 'always', label: 'Always True' },
  { value: 'sometimes', label: 'Sometimes True' },
  { value: 'rarely', label: 'Rarely True' },
]

const SECTION_B_COLUMNS: { value: string; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'notsure', label: 'Not Sure' },
]

// Counselor ka naam — yahan se aasani se badla ja sakta hai
const COUNSELOR_NAME = 'Nazia Batool'
const COUNSELOR_SIGNATURE_SRC = '/counselor-signature.png'

const PATHWAYS: { value: string; label: string }[] = [
  { value: 'entrepreneurship', label: 'Entrepreneurship / Self Employment' },
  { value: 'foreignJob', label: 'Foreign Job' },
  { value: 'higherEducation', label: 'Higher Education' },
  { value: 'localJob', label: 'Local Job Placement' },
]

function Tick() {
  return <span className="text-base font-bold leading-none">✓</span>
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <td className="border border-black px-2 py-1 align-top">
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </td>
  )
}

export default function CareerTestPrintable({
  record,
}: {
  record: PrintableRecord
}) {
  const date = new Date(record.testDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="hidden print:block">
      <div className="printable-form mx-auto bg-white text-black">
        {/* Header */}
        <div className="border-2 border-black p-3 text-center">
          <h1 className="text-lg font-bold uppercase">
            TEVTA Career Pathway Personality Test
          </h1>
          <p className="mt-1 text-[11px]">
            A Blended Assessment of Natural Strengths and Career Priorities
            (Post Admission)
          </p>
        </div>

        {/* Student Information */}
        <table className="mt-2 w-full border-collapse text-[11px]">
          <tbody>
            <tr>
              <InfoCell label="Student Name" value={record.studentName} />
              <InfoCell label="Roll No" value={record.rollNo} />
            </tr>
            <tr>
              <InfoCell label="Trade / Program" value={record.trade} />
              <InfoCell label="Institute" value={record.institute} />
            </tr>
            <tr>
              <InfoCell label="Date" value={date} />
              <td className="border border-black px-2 py-1" />
            </tr>
          </tbody>
        </table>

        {/* Section A */}
        <h2 className="mt-3 bg-black px-2 py-1 text-[12px] font-bold text-white">
          Section A: Natural Personality Traits
        </h2>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="w-8 border border-black px-1 py-1">Sr.</th>
              <th className="border border-black px-2 py-1 text-left">
                Statement
              </th>
              {SECTION_A_COLUMNS.map((c) => (
                <th
                  key={c.value}
                  className="w-20 border border-black px-1 py-1 text-center"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTION_A_STATEMENTS.map((s, idx) => (
              <tr key={s.key}>
                <td className="border border-black px-1 py-1 text-center align-top">
                  {idx + 1}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  <div>{s.en}</div>
                  <div dir="rtl" className="text-[10px] text-gray-700">
                    {s.ur}
                  </div>
                </td>
                {SECTION_A_COLUMNS.map((c) => (
                  <td
                    key={c.value}
                    className="border border-black px-1 py-1 text-center align-middle"
                  >
                    {record.sectionA?.[s.key] === c.value ? <Tick /> : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Section B */}
        <h2 className="mt-3 bg-black px-2 py-1 text-[12px] font-bold text-white">
          Section B: Career Priorities
        </h2>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="w-8 border border-black px-1 py-1">Sr.</th>
              <th className="border border-black px-2 py-1 text-left">
                Statement
              </th>
              {SECTION_B_COLUMNS.map((c) => (
                <th
                  key={c.value}
                  className="w-16 border border-black px-1 py-1 text-center"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTION_B_STATEMENTS.map((s, idx) => (
              <tr key={s.key}>
                <td className="border border-black px-1 py-1 text-center align-top">
                  {idx + 1}
                </td>
                <td className="border border-black px-2 py-1 align-top">
                  <div>{s.en}</div>
                  <div dir="rtl" className="text-[10px] text-gray-700">
                    {s.ur}
                  </div>
                </td>
                {SECTION_B_COLUMNS.map((c) => (
                  <td
                    key={c.value}
                    className="border border-black px-1 py-1 text-center align-middle"
                  >
                    {record.sectionB?.[s.key] === c.value ? <Tick /> : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Section C */}
        <h2 className="mt-3 bg-black px-2 py-1 text-[12px] font-bold text-white">
          Section C: Counselor Observation &amp; Recommendation
        </h2>
        <div className="border border-black p-2 text-[11px]">
          <p className="mb-2 font-semibold">Recommended Pathway:</p>
          <table className="w-full border-collapse text-[11px]">
            <tbody>
              {PATHWAYS.map((p) => (
                <tr key={p.value}>
                  <td className="w-8 border border-black px-1 py-1 text-center">
                    {record.recommendedPathway === p.value ? <Tick /> : ''}
                  </td>
                  <td
                    className={`border border-black px-2 py-1 ${
                      record.recommendedPathway === p.value ? 'font-bold' : ''
                    }`}
                  >
                    {p.label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex items-end justify-between">
            <div className="w-1/2">
              <div className="flex h-12 items-end border-b border-black pb-1">
                <span className="font-semibold">{COUNSELOR_NAME}</span>
              </div>
              <p className="mt-1">Counselor Name</p>
            </div>
            <div className="w-2/5">
              <div className="flex h-12 items-end justify-between border-b border-black pb-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={COUNSELOR_SIGNATURE_SRC}
                  alt="Counselor signature"
                  className="block max-h-12 w-auto max-w-[150px] object-contain"
                  style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                />
                <span className="pb-0.5">{date}</span>
              </div>
              <p className="mt-1">Signature &amp; Date</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          .printable-form {
            width: 100%;
            font-family: Arial, Helvetica, sans-serif;
            color: #000 !important;
          }
        }
      `}</style>
    </div>
  )
}
