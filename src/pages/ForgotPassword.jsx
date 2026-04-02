import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' })
    setSent(true); setLoading(false)
  }
  return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-10"><div className="w-8 h-8 bg-blue-600 rounded-lg mb-6" /><h1 className="text-2xl font-semibold tracking-tight">Recuperar senha</h1></div>
        {sent ? <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">Link enviado! Verifique seu e-mail.</div> : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500" placeholder="voce@empresa.com" /></div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">{loading ? 'Enviando...' : 'Enviar link'}</button>
          </form>
        )}
        <p className="mt-5 text-center text-xs text-neutral-500"><Link to="/login" className="text-blue-600 hover:underline">Voltar para o login</Link></p>
      </div>
    </div>
  )
}