'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, QrCode, Download, Share2, Edit, Star, Award, GraduationCap, Briefcase, Github, Linkedin, Phone } from 'lucide-react'

// Mock profile data — in production fetch from DB by student ID
const PROFILE = {
  name: 'Muhammad Ahmed Khan',
  rollNumber: 'GTTI-2024-001',
  department: 'Computer Technology',
  batch: '2022–2024',
  gpa: 3.92,
  email: 'ahmed.khan@email.com',
  phone: '0300-1234567',
  city: 'D.G. Khan',
  linkedin: 'linkedin.com/in/ahmed-khan',
  github: 'github.com/ahmedkhan',
  bio: 'Passionate software developer and AI enthusiast from GTTI D.G. Khan. Winner of Provincial Technical Skills Competition 2024. Building solutions for Pakistan\'s agricultural sector using modern technology.',
  skills: ['Python', 'React', 'Node.js', 'Machine Learning', 'SQL', 'Git', 'Arduino', 'HTML/CSS'],
  isShinningStar: true,
  starReason: 'First Position in Provincial Technical Skills Competition 2024',
  achievements: [
    '🥇 First Position — Provincial Technical Skills Competition 2024',
    '🏆 Best Final Year Project — AI Irrigation System',
    '📜 Python Certified — NAVTTC',
    '🎖️ Dean\'s Honor Roll — 2023 & 2024',
  ],
  projects: [
    { name: 'Smart Irrigation AI', tech: 'Python, TensorFlow, Raspberry Pi', desc: 'AI-based drip irrigation system for local farmers.' },
    { name: 'GTTI Alumni Network', tech: 'React, Node.js, MongoDB', desc: 'Web platform connecting GTTI graduates with employers.' },
  ],
  verifiedAt: '2024-01-15',
  qrUrl: 'https://gtti-portal.vercel.app/student/profile/1',
}

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview'|'skills'|'projects'>('overview')

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card rounded-2xl p-6 text-center border border-yellow-500/20">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border-2 border-yellow-400/50 flex items-center justify-center mx-auto">
                  <span className="font-display font-bold text-3xl text-yellow-400">
                    {PROFILE.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </span>
                </div>
                {PROFILE.isShinningStar && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Star size={14} fill="currentColor" className="text-gray-900" />
                  </div>
                )}
              </div>

              <h2 className="font-display font-bold text-xl text-slate-900 mb-1">{PROFILE.name}</h2>
              <p className="text-sm font-mono mb-1" style={{ color: 'var(--cyan)' }}>{PROFILE.rollNumber}</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{PROFILE.department}</p>

              {PROFILE.isShinningStar && (
                <div className="star-badge justify-center mb-4">
                  <Star size={11} fill="currentColor" /> Shining Star
                </div>
              )}

              <div className="text-left space-y-2 py-4 border-y mb-4" style={{ borderColor: 'var(--border)' }}>
                <InfoRow icon={GraduationCap} label={PROFILE.batch} />
                <InfoRow icon={Award}         label={`GPA: ${PROFILE.gpa}`} />
                {PROFILE.phone && <InfoRow icon={Phone} label={PROFILE.phone} />}
              </div>

              {/* Links */}
              <div className="flex gap-2 justify-center mb-4">
                {PROFILE.linkedin && (
                  <a href={`https://${PROFILE.linkedin}`} target="_blank" rel="noreferrer"
                    className="btn-outline text-xs py-1.5 px-3">
                    <Linkedin size={12} /> LinkedIn
                  </a>
                )}
                {PROFILE.github && (
                  <a href={`https://${PROFILE.github}`} target="_blank" rel="noreferrer"
                    className="btn-outline text-xs py-1.5 px-3">
                    <Github size={12} /> GitHub
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="btn-primary text-xs flex-1"><Download size={12} /> Download CV</button>
                <button className="btn-outline text-xs px-3"><Share2 size={12} /></button>
                <button className="btn-outline text-xs px-3"><Edit size={12} /></button>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="glass-card rounded-2xl p-6 text-center border border-cyan-500/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <QrCode size={18} className="text-cyan-400" />
                <h3 className="font-semibold text-slate-900 text-sm">Verified Profile QR</h3>
              </div>
              {/* QR placeholder — replace with react-qr-code in production */}
              <div className="w-32 h-32 mx-auto rounded-xl bg-white p-2 flex items-center justify-center mb-3">
                <div className="w-full h-full grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-gray-900' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Scan to verify this student's credentials
              </p>
              <p className="text-xs mt-1 font-mono" style={{ color: 'var(--cyan)' }}>
                Verified: {PROFILE.verifiedAt}
              </p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {(['overview', 'skills', 'projects'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === t ? 'bg-cyan-400 text-gray-900' : 'hover:bg-white/5'
                  }`}
                  style={activeTab !== t ? { color: 'var(--text-secondary)' } : {}}>
                  {t}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Bio */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-3">About</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{PROFILE.bio}</p>
                </div>

                {/* Star Achievement */}
                {PROFILE.isShinningStar && (
                  <div className="rounded-2xl p-5 border border-yellow-500/30"
                       style={{ background: 'rgba(251,191,36,0.05)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-yellow-400 fill-yellow-400/50" />
                      <h3 className="font-semibold text-yellow-400 text-sm">Shining Star Recognition</h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{PROFILE.starReason}</p>
                  </div>
                )}

                {/* Achievements */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Award size={16} className="text-cyan-400" /> Achievements
                  </h3>
                  <ul className="space-y-2">
                    {PROFILE.achievements.map((a, i) => (
                      <li key={i} className="text-sm py-2 border-b last:border-0 leading-relaxed"
                          style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {PROFILE.skills.map(s => (
                    <span key={s} className="badge badge-cyan py-2 px-3 text-sm">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-3">
                {PROFILE.projects.map((p, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 border border-cyan-500/10">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={16} className="text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{p.name}</h3>
                        <p className="text-xs mb-2 font-mono" style={{ color: 'var(--cyan)' }}>{p.tech}</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label }: { icon: React.FC<{size?: number; className?: string}>; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon size={14} className="text-cyan-400 flex-shrink-0" />
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  )
}
