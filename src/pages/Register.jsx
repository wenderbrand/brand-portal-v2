import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

const FEATURES = ['Editor profissional de marca', 'Portal público para clientes', 'Biblioteca de ativos', 'Templates prontos']

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = password.length >= 8 ? (password.match(/[A-Z]/) && password.match(/[0-9]/) ? 'strong' : 'medium') : password.length > 0 ? 'weak' : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Senha precisa ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/onboarding')
  }

  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-1 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-accent/5" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">B</span>
          </div>
          <span className="font-display font-bold text-ink-1 text-lg">BrandPortal</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-display font-semibold text-ink-1">Tudo que você precisa para entregar marcas com excelência.</h2>
          <div className="space-y-3 mt-6">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-emerald-400" />
                </div>
                <span className="text-sm text-ink-3">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-surface-2/50 border border-surface-4 rounded-2xl p-4">
          <p className="text-xs text-ink-4 mb-2">Plano gratuito inclui</p>
          <p className="text-sm text-ink-2 font-medium">3 projetos de marca · 500MB storage · Portal público</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">B</span>
            </div>
            <span className="font-display font-bold text-ink-1">BrandPortal</span>
          </div>

          <h1 className="text-2xl font-display font-bold text-ink-1 mb-1">Criar conta grátis</h1>
          <p className="text-sm text-ink-4 mb-8">Comece em minutos, sem cartão de crédito</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">E-mail profissional</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input-field" placeholder="voce@empresa.com" />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="input-field pr-11" placeholder="Mínimo 6 caracteres" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink-3">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {strength && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">
                    {['weak', 'medium', 'strong'].map((s, i) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
                        (strength === 'weak' && i === 0) ? 'bg-red-500' :
                        (strength === 'medium' && i <= 1) ? 'bg-amber-500' :
                        (strength === 'strong') ? 'bg-emerald-500' : 'bg-surface-4'
                      }`} />
                    ))}
                  </div>
                  <span className={`text-xs ${strength === 'weak' ? 'text-red-400' : strength === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {strength === 'weak' ? 'Fraca' : strength === 'medium' ? 'Média' : 'Forte'}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full h-11">
              {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Criar conta <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-ink-5">
            Ao criar uma conta, você concorda com os{' '}
            <span className="text-ink-4 hover:text-ink-3 cursor-pointer">Termos de Uso</span>
          </p>

          <p className="mt-4 text-center text-sm text-ink-4">
            Já tem conta?{' '}
            <Link to="/login" className="text-accent hover:text-indigo-400 font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
