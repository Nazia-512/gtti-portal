'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FileText, Sparkles, Download, Plus, Trash2, ArrowLeft, CheckCircle, Loader } from 'lucide-react'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

interface CVData {
  name: string; email: string; phone: string; city: string; linkedin: string; github: string
  objective: string; education: { degree: string; institution: string; year: string; grade: string }[]
  experience: { title: string; company: string; duration: string; bullets: string[] }[]
  skills: string[]; certifications: string[]; projects: { name: string; desc: string; tech: string }[]
}

const EMPTY_CV: CVData = {
  name: '', email: '', phone: '', city: '', linkedin: '', github: '',
  objective: '',
  education: [{ degree: '', institution: 'GTTI D.G. Khan', year: '', grade: '' }],
  experience: [],
  skills: [],
  certifications: [],
  projects: [],
}

export default function CVBuilderPage() {
  const [cv,        setCV]        = useState<CVData>(EMPTY_CV)
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState(false)
  const [aiCV,      setAiCV]      = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [photo, setPhoto] = useState<string>('')
  const [step,      setStep]      = useState<'form'|'preview'>('form')

  const updateField = (field: keyof CVData, value: unknown) =>
    setCV(prev => ({ ...prev, [field]: value }))

  const addSkill = () => {
    if (skillInput.trim()) {
      updateField('skills', [...cv.skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (i: number) =>
    updateField('skills', cv.skills.filter((_, idx) => idx !== i))
  

  const downloadPDF = () => {
    const doc = new jsPDF()
  
    // ── Header Background ──
    doc.setFillColor(10, 25, 47)
    doc.rect(0, 0, 210, 45, 'F')
  
    // ── Photo ──
    if (photo) {
      doc.addImage(photo, 'JPEG', 12, 7, 30, 30)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(cv.name.toUpperCase(), 48, 18)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(180, 220, 255)
      doc.text(`${cv.email}  |  ${cv.phone}  |  ${cv.city}`, 48, 26)
      if (cv.linkedin) doc.text(`LinkedIn: ${cv.linkedin}`, 48, 32)
      if (cv.github) doc.text(`GitHub: ${cv.github}`, 48, 38)
    } else {
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(cv.name.toUpperCase(), 105, 18, { align: 'center' })
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(180, 220, 255)
      doc.text(`${cv.email}  |  ${cv.phone}  |  ${cv.city}`, 105, 27, { align: 'center' })
      if (cv.linkedin) doc.text(`LinkedIn: ${cv.linkedin}`, 105, 33, { align: 'center' })
      if (cv.github) doc.text(`GitHub: ${cv.github}`, 105, 39, { align: 'center' })
    }
  
    // ── Cyan line ──
    doc.setDrawColor(0, 188, 212)
    doc.setLineWidth(1)
    doc.line(0, 45, 210, 45)
  
    // ── Content ──
    let y = 55
  
    const addSection = (title: string, content: string) => {
      if (!content.trim()) return
      if (y > 270) { doc.addPage(); y = 20 }
  
      // Section header
      doc.setFillColor(0, 188, 212)
      doc.rect(12, y - 4, 186, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(title.toUpperCase(), 15, y + 1)
      y += 12
  
      // Section content
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
     const lines = doc.splitTextToSize(content.trim(), 172)
lines.forEach((line: string) => {
  if (y > 278) { doc.addPage(); y = 20 }
  if (title === 'SKILLS') {
    doc.setFillColor(0, 188, 212)
    doc.circle(17, y - 1.5, 1.5, 'F')
    doc.text(line, 22, y)
  
  } else {
    doc.text(line, 15, y)
  }
    y += 5.5
  })
    y += 5
  }

  // ── Parse CV text into sections ──
  
    // ── Parse CV text into sections ──
    const sectionTitles = ['CAREER OBJECTIVE', 'EDUCATION', 'SKILLS','EXPERIENCE', 'PROJECTS', 'REFERENCES']
    const cvLines = aiCV.split('\n')
    
    let currentTitle = ''
    let currentContent: string[] = []
  
    cvLines.forEach(line => {
      const trimmed = line.trim()
      
      // Skip header lines
      if (trimmed.includes('NAME:') || trimmed.includes('EMAIL:') || 
          trimmed.startsWith('+--') || trimmed === '') {
        if (trimmed === '' && currentTitle && currentContent.length > 0) return
        return
      }
  
      // Check if this line is a section title
      const matchedTitle = sectionTitles.find(t => trimmed === t || trimmed === t + ':')
      
      if (matchedTitle) {
        // Save previous section
        if (currentTitle && currentContent.length > 0) {
          addSection(currentTitle, currentContent.join('\n'))
        }
        currentTitle = matchedTitle
        currentContent = []
      } else if (trimmed && !trimmed.match(/^-{3,}$/)) {
        // Add content line (skip separator lines)
        if (currentTitle) {
          currentContent.push(trimmed)
        }
      }
    })
  
    // Save last section
    if (currentTitle && currentContent.length > 0) {
      addSection(currentTitle, currentContent.join('\n'))
    }
  
    // ── Footer ──
    doc.setFillColor(10, 25, 47)
    doc.rect(0, 287, 210, 10, 'F')
    doc.setTextColor(180, 220, 255)
    doc.setFontSize(7)
    doc.text('Generated by GTTI D.G. Khan Career Portal', 105, 293, { align: 'center' })
  
    doc.save(`${cv.name}_CV.pdf`)
  }
  
  const downloadWord = async () => {
    const paragraphs = aiCV.split('\n').map(line => 
      new Paragraph({
        children: [new TextRun({ text: line, size: 22 })]
      })
    )
    const doc = new Document({ sections: [{ children: paragraphs }] })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${cv.name}_CV.docx`)
  }

  const generateAICV = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cv-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: cv }),
      })
      const data = await res.json()
      setAiCV(data.cv)
      setGenerated(true)
      setStep('preview')
    } catch {
      alert('Failed to generate CV. Please check your API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Portal
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
            <FileText size={24} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">AI CV Builder</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Generate an ATS-optimized, professional resume powered by Claude AI
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['form', 'preview'] as const).map(t => (
            <button key={t} onClick={() => setStep(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                step === t ? 'bg-cyan-400 text-gray-900' : 'hover:bg-white/5'
              }`}
              style={step !== t ? { color: 'var(--text-secondary)' } : {}}>
              {t === 'form' ? '1. Fill Details' : '2. AI Generated CV'}
              {generated && t === 'preview' && <CheckCircle size={14} className="inline ml-1" />}
            </button>
          ))}
        </div>

        {step === 'form' && (
          <div className="space-y-6">
            {/* Photo Upload */}
<div className="glass-card rounded-2xl p-6">
  <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
    <span className="w-6 h-6 rounded-full bg-cyan-400 text-xs text-gray-900 font-bold flex items-center justify-center">📷</span>
    Profile Photo
  </h2>
  <div className="flex items-center gap-4">
    {photo ? (
      <img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400" />
    ) : (
      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-cyan-400/50 flex items-center justify-center">
        <span style={{ color: 'var(--text-muted)' }} className="text-xs text-center">No Photo</span>
      </div>
    )}
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = () => setPhoto(reader.result as string)
            reader.readAsDataURL(file)
          }
        }}
        className="hidden"
        id="photo-upload"
      />
      <label htmlFor="photo-upload" className="btn-primary text-sm cursor-pointer">
        Upload Photo
      </label>
      {photo && (
        <button onClick={() => setPhoto('')} className="btn-outline text-sm ml-2">
          Remove
        </button>
      )}
    </div>
  </div>
</div>
            {/* Personal Info */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-xs text-gray-900 font-bold flex items-center justify-center">1</span>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { f: 'name',     p: 'Full Name *',    t: 'text'  },
                  { f: 'email',    p: 'Email Address *', t: 'email' },
                  { f: 'phone',    p: 'Phone Number',   t: 'tel'   },
                  { f: 'city',     p: 'City',           t: 'text'  },
                  { f: 'linkedin', p: 'LinkedIn URL',   t: 'url'   },
                  { f: 'github',   p: 'GitHub URL',     t: 'url'   },
                ].map(({ f, p, t }) => (
                  <input key={f} type={t} placeholder={p} value={String(cv[f as keyof CVData] ?? '')}
                    onChange={e => updateField(f as keyof CVData, e.target.value)}
                    className="input-field" />
                ))}
              </div>
            </div>

            {/* Objective */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-xs text-gray-900 font-bold flex items-center justify-center">2</span>
                Career Objective <span className="text-xs font-normal badge badge-cyan ml-2">AI will enhance this</span>
              </h2>
              <textarea placeholder="Write 1-2 sentences about your career goals..."
                value={cv.objective}
                onChange={e => updateField('objective', e.target.value)}
                rows={3} className="input-field resize-none" />
            </div>

            {/* Education */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-xs text-gray-900 font-bold flex items-center justify-center">3</span>
                Education
              </h2>
              {cv.education.map((edu, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input placeholder="Degree / Diploma *" value={edu.degree}
                    onChange={e => { const ed = [...cv.education]; ed[i].degree = e.target.value; updateField('education', ed) }}
                    className="input-field" />
                  <input placeholder="Institution *" value={edu.institution}
                    onChange={e => { const ed = [...cv.education]; ed[i].institution = e.target.value; updateField('education', ed) }}
                    className="input-field" />
                  <input placeholder="Year (e.g. 2022–2024)" value={edu.year}
                    onChange={e => { const ed = [...cv.education]; ed[i].year = e.target.value; updateField('education', ed) }}
                    className="input-field" />
                  <input placeholder="Grade / GPA" value={edu.grade}
                    onChange={e => { const ed = [...cv.education]; ed[i].grade = e.target.value; updateField('education', ed) }}
                    className="input-field" />
                </div>
              ))}
              <button onClick={() => updateField('education', [...cv.education, { degree: '', institution: '', year: '', grade: '' }])}
                className="btn-outline text-xs py-2 px-4">
                <Plus size={14} /> Add Education
              </button>
            </div>

            {/* Skills */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-xs text-gray-900 font-bold flex items-center justify-center">4</span>
                Skills
              </h2>
              <div className="flex gap-2 mb-4">
                <input placeholder="Add a skill (e.g. Python, AutoCAD...)"
                  value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  className="input-field flex-1" />
                <button onClick={addSkill} className="btn-primary py-2 px-4"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cv.skills.map((s, i) => (
                  <span key={i} className="badge badge-cyan flex items-center gap-1.5 py-1.5">
                    {s}
                    <button onClick={() => removeSkill(i)} className="hover:text-red-400 transition-colors">
                      <Trash2 size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
{/* Experience */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-400 text-xs text-gray-900 font-bold flex items-center justify-center">5</span>
            Experience (Optional)
          </h2>
          {cv.experience.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input placeholder="Job Title" value={exp.title}
                onChange={e => { const ex = [...cv.experience]; ex[i].title = e.target.value; updateField('experience', ex) }}
                className="input-field" />
              <input placeholder="Company Name" value={exp.company}
                onChange={e => { const ex = [...cv.experience]; ex[i].company = e.target.value; updateField('experience', ex) }}
                className="input-field" />
              <input placeholder="Duration (e.g. 2022-2024)" value={exp.duration}
                onChange={e => { const ex = [...cv.experience]; ex[i].duration = e.target.value; updateField('experience', ex) }}
                className="input-field sm:col-span-2" />
            </div>
          ))}
          <button onClick={() => updateField('experience', [...cv.experience, { title: '', company: '', duration: '', bullets: [] }])}
            className="btn-outline text-xs py-2 px-4">
            <Plus size={14} /> Add Experience
          </button>
        </div>
            {/* Projects */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-400 text-xs text-gray-900 font-bold flex items-center justify-center">5</span>
                Projects (Optional)
              </h2>
              {cv.projects.map((proj, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input placeholder="Project Name" value={proj.name}
                    onChange={e => { const p = [...cv.projects]; p[i].name = e.target.value; updateField('projects', p) }}
                    className="input-field" />
                  <input placeholder="Technologies Used" value={proj.tech}
                    onChange={e => { const p = [...cv.projects]; p[i].tech = e.target.value; updateField('projects', p) }}
                    className="input-field" />
                  <textarea placeholder="Brief description..." value={proj.desc} rows={2}
                    onChange={e => { const p = [...cv.projects]; p[i].desc = e.target.value; updateField('projects', p) }}
                    className="input-field sm:col-span-2 resize-none" />
                </div>
              ))}
              <button onClick={() => updateField('projects', [...cv.projects, { name: '', desc: '', tech: '' }])}
                className="btn-outline text-xs py-2 px-4">
                <Plus size={14} /> Add Project
              </button>
            </div>

            {/* Generate Button */}
            <button onClick={generateAICV} disabled={loading || !cv.name || !cv.email}
              className="w-full btn-gold text-base py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <><Loader size={18} className="animate-spin" /> Generating with Claude AI...</>
                : <><Sparkles size={18} /> Generate ATS-Optimized CV with AI</>}
            </button>
          </div>
        )}

        {step === 'preview' && (
          <div>
            {generated ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-400" /> Your AI-Generated CV
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={downloadPDF} className="btn-primary text-sm flex items-center gap-2">
                      <Download size={15} /> Download PDF
                    </button>
                    <button onClick={downloadWord} className="btn-outline text-sm flex items-center gap-2">
                      <Download size={15} /> Download Word
                    </button>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-8">
  {/* Header with photo */}
  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
    {photo && (
      <img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 flex-shrink-0" />
    )}
    <div>
      <h2 className="font-bold text-2xl text-white">{cv.name}</h2>
      <p className="text-cyan-400 text-sm mt-1">{cv.email} | {cv.phone} | {cv.city}</p>
      {cv.linkedin && <p className="text-sm mt-1" style={{color:'var(--text-secondary)'}}>LinkedIn: {cv.linkedin}</p>}
      {cv.github && <p className="text-sm" style={{color:'var(--text-secondary)'}}>GitHub: {cv.github}</p>}
    </div>
  </div>
  {/* CV Content */}
  <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap"
       style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
    {aiCV.replace(/\+--+\+[\s\S]*?CURRICULUM VITAE[\s\S]*?\+--+\+/, '')
         .replace(/NAME:.*\n/, '')
         .replace(/EMAIL:.*\n/, '')
         .trim()}
  </div>
</div>
              </div>
            ) : (
              <div className="text-center py-20 glass-card rounded-2xl">
                <FileText size={48} className="mx-auto mb-4 opacity-20 text-cyan-400" />
                <p style={{ color: 'var(--text-muted)' }}>Fill in your details and generate your CV first.</p>
                <button onClick={() => setStep('form')} className="btn-outline mt-4">Go to Form</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
