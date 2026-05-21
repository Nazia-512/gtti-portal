'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Sparkles, ArrowLeft, Loader, Copy, CheckCheck, RotateCcw } from 'lucide-react'

const EXAMPLE_TOPICS = [
  'Explain how transistors work in electronics',
  'What is Object Oriented Programming?',
  'Explain AC vs DC current simply',
  'What is the OSI model in networking?',
  'How does a hydraulic system work?',
  'Explain SQL database joins',
]

export default function LessonSimplifierPage() {
  const [topic,     setTopic]     = useState('')
  const [level,     setLevel]     = useState<'beginner'|'intermediate'|'advanced'>('beginner')
  const [language,  setLanguage]  = useState<'english'|'urdu'>('english')
  const [result,    setResult]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [copied,    setCopied]    = useState(false)

  const simplify = async (text?: string) => {
    const content = text || topic
    if (!content.trim() || loading) return
    setLoading(true)
    setResult('')

    try {
      const prompt = `You are a brilliant teacher for Pakistani technical students at GTTI D.G. Khan.

Topic to explain: "${content}"
Level: ${level}
Language: ${language === 'urdu' ? 'Urdu (Roman/script)' : 'Simple English'}

Explain this topic in a way that is:
1. Super easy to understand for a ${level} student
2. Use real-life Pakistani examples (local context)
3. Break it into clear numbered points
4. Include a simple analogy or story to help remember
5. End with 3 key takeaways
6. If ${language === 'urdu'}, write in simple Roman Urdu or mix English terms where needed

Format:
📚 Simple Explanation:
[explanation here]

💡 Real Life Example:
[example here]

🔑 3 Key Points to Remember:
1.
2.
3.

✅ Practice Question:
[one simple practice question]`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      })
      const data = await res.json()
      setResult(data.reply || 'Failed to simplify.')
    } catch {
      setResult('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400/20 to-amber-600/20 border border-orange-400/30 flex items-center justify-center">
            <BookOpen size={24} className="text-orange-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">AI Lesson Simplifier</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Paste any topic — Claude AI breaks it down for you
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <textarea
            placeholder="Enter a topic, paste a paragraph from your textbook, or describe something you don't understand..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            rows={4}
            className="input-field resize-none mb-4"
          />

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Level */}
            <div className="flex-1">
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Difficulty Level</label>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map(l => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                      level === l ? 'bg-orange-400 text-gray-900' : 'hover:bg-orange-400/10 hover:text-orange-400'
                    }`}
                    style={level !== l ? { color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)' } : {}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="text-xs mb-2 block" style={{ color: 'var(--text-muted)' }}>Language</label>
              <div className="flex gap-2">
                {(['english', 'urdu'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                      language === l ? 'bg-orange-400 text-gray-900' : 'hover:bg-orange-400/10 hover:text-orange-400'
                    }`}
                    style={language !== l ? { color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)' } : {}}>
                    {l === 'urdu' ? 'اردو / Roman' : 'English'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={() => simplify()} disabled={loading || !topic.trim()}
            className="w-full btn-gold text-base py-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            {loading
              ? <><Loader size={18} className="animate-spin" /> Simplifying with Claude AI...</>
              : <><Sparkles size={18} /> Simplify This Topic</>}
          </button>
        </div>

        {/* Quick topics */}
        {!result && !loading && (
          <div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Try these examples:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_TOPICS.map(t => (
                <button key={t} onClick={() => { setTopic(t); simplify(t) }}
                  className="glass-card rounded-xl p-3 text-xs text-left hover:border-orange-400/40 transition-all"
                  style={{ color: 'var(--text-secondary)' }}>
                  📖 {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-orange-400" /> AI Explanation
              </h2>
              <div className="flex gap-2">
                <button onClick={() => { setResult(''); setTopic('') }}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--text-muted)' }}
                  title="Reset">
                  <RotateCcw size={14} />
                </button>
                <button onClick={copy}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  {copied ? <><CheckCheck size={14} className="text-green-400" /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
