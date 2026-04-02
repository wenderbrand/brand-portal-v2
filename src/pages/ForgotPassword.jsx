import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">B</span>
          </div>
          <span className="font-display font-bold text-ink-1">BrandPortal</span>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Mail size={24} className="text-emerald-400" />
            </div>
            <h1 className="text-xl font-display font-bold text-ink-1">E-mail enviado!</h1>
            <p className="text-sm text-ink-4">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
            <Link to="/login" className="btn-secondary w-full mt-4 h-11 flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-display font-bold text-ink-1 mb-1">Recuperar senha</h1>
            <p className="text-sm text-ink-4 mb-8">Enviaremos um link para redefinir sua senha</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="input-field" placeholder="voce@empresa.com" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full h-11">
                {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Enviar link'}
              </button>
            </form>
            <Link to="/login" className="flex items-center justify-center gap-1.5 mt-5 text-sm text-ink-4 hover:text-ink-3 transition-colors">
              <ArrowLeft size={14} /> Voltar ao login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
