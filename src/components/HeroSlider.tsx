'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, MessageSquare, Briefcase, Star, LayoutDashboard, Bell } from 'lucide-react'

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState<any[]>([])
  const [news, setNews] = useState<string[]>([
    '🎓 GTTI D.G. Khan — Pakistan ka best technical institute',
    '🤖 AI CV Builder available — Build your CV in seconds!',
  ])

  useEffect(() => {
    // Slides fetch karo
    fetch('/api/admin/slider')
      .then(r => r.json())
      .then(d => { if (d.slides?.length > 0) setSlides(d.slides) })

    // Announcements fetch karo
    fetch('/api/announcements')
      .then(r => r.json())
      .then(d => {
        if (d.announcements?.length > 0) {
          setNews(d.announcements.map((a: any) => `📢 ${a.title}`))
        }
      })
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides])

  const DEFAULT_SLIDES = [
    { title: 'Welcome to GTTI Smart Portal', subtitle: 'Empowering Future Tech Leaders', color: 'from-blue-900 via-blue-800 to-cyan-900' },
    { title: 'AI Powered CV Builder', subtitle: 'Build Professional CVs in Seconds', color: 'from-indigo-900 via-blue-800 to-blue-900' },
    { title: 'Career Guidance Chatbot', subtitle: 'Get Expert Career Advice 24/7', color: 'from-cyan-900 via-blue-800 to-indigo-900' },
  ]

  const displaySlides = slides.length > 0 ? slides : DEFAULT_SLIDES

  return (
    <div className="w-full">
      {/* Slider */}
      <div className="relative w-full h-[380px] overflow-hidden">
        {displaySlides.map((slide: any, i: number) => (
          <div key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            {slide.image ? (
              <div className="relative w-full h-full">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white px-8">
                    <h2 className="font-display font-bold text-4xl mb-4 drop-shadow-lg">{slide.title}</h2>
                    {slide.subtitle && <p className="text-xl text-cyan-300 drop-shadow">{slide.subtitle}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`w-full h-full bg-gradient-to-r ${slide.color} flex items-center justify-center`}>
                <div className="text-center text-white px-8">
                  <h2 className="font-display font-bold text-4xl mb-4 drop-shadow-lg">{slide.title}</h2>
                  <p className="text-xl text-cyan-300 drop-shadow">{slide.subtitle}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {displaySlides.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'bg-cyan-400 w-6' : 'bg-white/40 w-2'}`} />
          ))}
        </div>
      </div>

      {/* News Ticker */}
      <div className="w-full overflow-hidden py-2 flex items-center gap-3"
           style={{ background: '#1e3a8a', borderTop: '1px solid rgba(96,165,250,0.3)', borderBottom: '1px solid rgba(96,165,250,0.3)' }}>
        <span className="text-xs font-bold px-3 py-1 rounded flex-shrink-0 bg-cyan-400 text-blue-900">
          📢 NEWS
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...news, ...news].map((item, i) => (
              <span key={i} className="text-sm text-white flex-shrink-0">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Parts */}
      <div className="grid grid-cols-1 md:grid-cols-3"
           style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="p-8 flex flex-col justify-center items-center text-center"
             style={{ borderRight: '1px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center mb-4">
            <FileText size={32} className="text-cyan-400" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>AI CV Builder</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Apna professional CV banao — AI khud skills suggest karega</p>
          <Link href="/cv-builder" className="btn-primary text-sm">Build CV Now</Link>
        </div>

        <div className="p-8 flex flex-col justify-center items-center text-center"
             style={{ borderRight: '1px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl bg-blue-400/20 border border-blue-400/40 flex items-center justify-center mb-4">
            <MessageSquare size={32} className="text-blue-400" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Career Chatbot</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>AI se career guidance lo — kisi bhi field ke liye</p>
          <Link href="/student/chat" className="btn-primary text-sm">Chat Now</Link>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-sm mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>QUICK LINKS</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Briefcase, title: 'Jobs Board', href: '/jobs', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
              { icon: Star, title: 'Shining Stars', href: '/shining-stars', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
              { icon: LayoutDashboard, title: 'Admin Panel', href: '/admin', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
              { icon: Bell, title: 'Announcements', href: '/admin/announcements', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
            ].map(tool => (
              <Link key={tool.title} href={tool.href}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl hover:scale-105 transition-all text-center border ${tool.bg}`}>
                <tool.icon size={22} className={tool.color} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}