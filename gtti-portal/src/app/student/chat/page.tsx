'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, Send, ArrowLeft, Sparkles, RotateCcw, Cpu } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
  'What are job opportunities after DAE Computer Technology?',
  'How do I prepare for a technical interview?',
  'Explain Python basics in simple language',
  'How to apply for B.Tech after DAE?',
  'What skills are in demand in Pakistan IT sector?',
  'Help me write a professional email to an employer',
]

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
        isUser
          ? 'bg-gradient-to-br from-cyan-400 to-blue-600'
          : 'bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30'
      }`}>
        {isUser
          ? <span className="text-xs font-bold text-white">You</span>
          : <Cpu size={14} className="text-yellow-400" />}
      </div>

      {/* Bubble */}
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
          {msg.content}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30">
        <Cpu size={14} className="text-yellow-400" />
      </div>
      <div className="chat-bubble-ai">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                 style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages]   = useState<Message[]>([])
  const [input,    setInput]      = useState('')
  const [loading,  setLoading]    = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')

    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Fixed Header */}
      <div className="glass border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
                <MessageSquare size={18} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="font-semibold text-white text-sm">GTTI AI Assistant</h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by Claude AI</span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => setMessages([])}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--text-muted)' }}
            title="Clear chat">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-600/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-cyan-400" />
              </div>
              <h2 className="font-display font-semibold text-xl text-white mb-2">Ask Me Anything!</h2>
              <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                I'm your AI assistant for career guidance, academics, and skills development.
                Ask in English or Urdu!
              </p>

              {/* Quick prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto text-left">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="glass-card rounded-xl p-3 text-xs text-left hover:border-cyan-400/40 transition-all"
                    style={{ color: 'var(--text-secondary)' }}>
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="glass border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask about careers, courses, skills... (English ya Urdu mein)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              className="input-field flex-1"
              disabled={loading}
            />
            <button onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
            AI responses are for guidance only. Always verify important decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
