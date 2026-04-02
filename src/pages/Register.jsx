import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false) } else navigate('/dashboard')
  }
  return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-10"><div className="w-8 h-8 bg-blue-600 rounded-lg mb-6" /><h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1><p className="text-sm text-neutral-500 mt-1">Comece a usar o Brand Portal</p></div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="voce@empresa.com" /></div>
          <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Senha</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Mínimo 6 caracteres" /></div>
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">{loading ? 'Criando...' : 'Criar conta'}</button>
        </form>
        <p className="mt-5 text-center text-xs text-neutral-500">Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link></p>
      </div>
    </div>
  )
}