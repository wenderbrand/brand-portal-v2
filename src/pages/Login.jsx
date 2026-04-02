import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) } else navigate('/dashboard')
  }
  return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-10"><div className="w-8 h-8 bg-blue-600 rounded-lg mb-6" /><h1 className="text-2xl font-semibold tracking-tight">Entrar</h1><p className="text-sm text-neutral-500 mt-1">Acesse seu Brand Portal</p></div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="voce@empresa.com" /></div>
          <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="••••••••" /></div>
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <div className="mt-5 flex justify-between text-xs text-neutral-500"><Link to="/register" className="hover:text-blue-600">Criar conta</Link><Link to="/forgot-password" className="hover:text-blue-600">Esqueci a senha</Link></div>
      </div>
    </div>
  )
}