import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function NewProjectModal({ onClose, onCreated, userId }) {
  const [name, setName] = useState('')
  const [logo, setLogo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true); setError('')
    try {
      let logo_url = null
      if (logo) {
        const ext = logo.name.split('.').pop()
        const path = userId + '/' + Date.now() + '.' + ext
        const { error: upErr } = await supabase.storage.from('logos').upload(path, logo)
        if (!upErr) { const { data } = supabase.storage.from('logos').getPublicUrl(path); logo_url = data.publicUrl }
      }
      const { data, error } = await supabase.from('projects').insert({ user_id: userId, name: name.trim(), logo_url }).select().single()
      if (error) throw error
      onCreated(data)
    } catch(e) { setError(e.message); setLoading(false) }
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-5">Novo projeto</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Nome da marca *</label><input value={name} onChange={e=>setName(e.target.value)} required autoFocus className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" placeholder="Ex: Acme Inc" /></div>
          <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Logo (opcional)</label><input type="file" accept="image/*" onChange={e=>setLogo(e.target.files[0])} className="w-full text-sm text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-neutral-100 file:text-neutral-800 cursor-pointer" /></div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-neutral-200 rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">{loading ? 'Criando...' : 'Criar projeto'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Dashboard({ user }) {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setProjects(data || []); setLoading(false) })
  }, [user.id])
  function handleCreated(project) { setShowModal(false); navigate('/editor/' + project.id) }
  async function handleLogout() { await supabase.auth.signOut() }
  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5"><div className="w-6 h-6 bg-blue-600 rounded-md" /><span className="text-sm font-semibold">Brand Portal</span></div>
        <div className="flex items-center gap-4"><span className="text-xs text-neutral-400 hidden sm:block">{user.email}</span><button onClick={handleLogout} className="text-xs text-neutral-400 hover:text-neutral-800 transition-colors">Sair</button></div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold">Projetos</h1>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"><span className="text-base leading-none">+</span> Novo projeto</button>
        </div>
        {loading ? <div className="text-sm text-neutral-400">Carregando...</div> : projects.length === 0 ? (
          <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-16 text-center">
            <p className="text-neutral-400 text-sm mb-4">Nenhum projeto ainda</p>
            <button onClick={() => setShowModal(true)} className="text-blue-600 text-sm font-medium hover:underline">Criar primeiro projeto →</button>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map(p => (
              <div key={p.id} className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-4">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} className="w-10 h-10 rounded-lg object-contain bg-neutral-50" /> : <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs font-medium">{p.name.charAt(0).toUpperCase()}</div>}
                <div className="flex-1 min-w-0"><h3 className="text-sm font-medium truncate">{p.name}</h3><span className={"text-xs " + (p.is_published ? 'text-green-600' : 'text-neutral-400')}>{p.is_published ? 'Publicado' : 'Rascunho'}</span></div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.is_published && p.slug && <a href={'/p/' + p.slug} target="_blank" rel="noreferrer" className="text-xs border border-neutral-200 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors text-neutral-500">Ver portal</a>}
                  <button onClick={() => navigate('/editor/' + p.id)} className="text-xs bg-neutral-900 text-white rounded-lg px-3 py-1.5 hover:bg-neutral-700 transition-colors">Editar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreated={handleCreated} userId={user.id} />}
    </div>
  )
}