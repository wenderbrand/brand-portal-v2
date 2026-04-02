import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/layout/Sidebar'
import {
  Plus, Search, Bell, MoreHorizontal, ExternalLink,
  Globe, FileText, Clock, Download, Trash2, Copy,
  CheckCircle, Circle, Layers, ArrowRight, X
} from 'lucide-react'

const TEMPLATES = [
  { id: 'essencial', name: 'Essencial', desc: 'Capa, logo, cores e tipografia', modules: 4, badge: 'Popular' },
  { id: 'completo', name: 'Completo', desc: 'Todos os módulos de identidade', modules: 9, badge: 'Recomendado' },
  { id: 'minimalista', name: 'Minimalista', desc: 'Layout clean, só o essencial', modules: 3, badge: null },
]

function NewProjectModal({ onClose, onCreated, userId }) {
  const [step, setStep] = useState(0) // 0: name, 1: template
  const [name, setName] = useState('')
  const [logo, setLogo] = useState(null)
  const [template, setTemplate] = useState('essencial')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      let logo_url = null
      if (logo) {
        const ext = logo.name.split('.').pop()
        const path = `${userId}/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('logos').upload(path, logo)
        if (!upErr) {
          const { data } = supabase.storage.from('logos').getPublicUrl(path)
          logo_url = data.publicUrl
        }
      }
      const { data, error } = await supabase.from('projects').insert({
        user_id: userId, name: name.trim(), logo_url, template
      }).select().single()
      if (error) throw error
      onCreated(data)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-2 border border-surface-4 rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-4">
          <div>
            <h2 className="font-display font-bold text-ink-1 text-lg">Novo projeto de marca</h2>
            <p className="text-xs text-ink-4 mt-0.5">Passo {step + 1} de 2</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        <div className="p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="label">Nome da marca *</label>
                <input value={name} onChange={e => setName(e.target.value)} autoFocus
                  className="input-field" placeholder="Ex: Acme Studio" onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)} />
              </div>
              <div>
                <label className="label">Logo (opcional)</label>
                <div className="border-2 border-dashed border-surface-5 rounded-xl p-4 text-center hover:border-accent/40 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('logo-upload').click()}>
                  {logo ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-ink-2">
                      <CheckCircle size={16} className="text-emerald-400" />
                      {logo.name}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-ink-4">Clique para enviar ou arraste aqui</p>
                      <p className="text-xs text-ink-5 mt-1">PNG, JPG, SVG · Máx 5MB</p>
                    </div>
                  )}
                </div>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={e => setLogo(e.target.files[0])} />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="btn-secondary flex-1 h-11">Cancelar</button>
                <button onClick={() => setStep(1)} disabled={!name.trim()} className="btn-primary flex-1 h-11">
                  Próximo <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-ink-4">Escolha um template para começar</p>
              <div className="space-y-3">
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      template === t.id ? 'border-accent bg-accent/5' : 'border-surface-4 hover:border-surface-5'
                    }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${template === t.id ? 'bg-accent/20' : 'bg-surface-3'}`}>
                      <Layers size={16} className={template === t.id ? 'text-accent' : 'text-ink-4'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium text-sm ${template === t.id ? 'text-ink-1' : 'text-ink-2'}`}>{t.name}</p>
                        {t.badge && <span className="badge badge-purple text-[10px] py-0.5">{t.badge}</span>}
                      </div>
                      <p className="text-xs text-ink-4">{t.desc} · {t.modules} módulos</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${template === t.id ? 'border-accent bg-accent' : 'border-surface-5'}`}>
                      {template === t.id && <div className="w-full h-full rounded-full bg-white scale-50" />}
                    </div>
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(0)} className="btn-secondary h-11 px-4">← Voltar</button>
                <button onClick={handleCreate} disabled={loading} className="btn-primary flex-1 h-11">
                  {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Criar projeto'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="card group relative overflow-hidden">
      {/* Cover */}
      <div className="h-32 bg-surface-3 relative overflow-hidden">
        {project.logo_url ? (
          <img src={project.logo_url} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-4 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-ink-4">{project.name?.charAt(0)?.toUpperCase()}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-2/80 to-transparent" />
        {/* Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
              className="w-8 h-8 rounded-lg bg-surface-1/80 backdrop-blur-sm border border-surface-4 flex items-center justify-center text-ink-3 hover:text-ink-1 transition-colors">
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 w-40 bg-surface-2 border border-surface-4 rounded-xl shadow-xl z-10 py-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => { navigate(`/editor/${project.id}`); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-3 hover:text-ink-1 hover:bg-surface-3 transition-colors">
                  <FileText size={14} /> Editar
                </button>
                {project.is_published && project.slug && (
                  <a href={`/p/${project.slug}`} target="_blank" rel="noreferrer"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-3 hover:text-ink-1 hover:bg-surface-3 transition-colors">
                    <ExternalLink size={14} /> Ver portal
                  </a>
                )}
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/p/${project.slug}`); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-3 hover:text-ink-1 hover:bg-surface-3 transition-colors">
                  <Copy size={14} /> Copiar link
                </button>
                <div className="my-1 border-t border-surface-4" />
                <button onClick={() => { onDelete(project.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-medium text-ink-1 text-sm truncate">{project.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {project.is_published ? (
                <span className="badge-green badge py-0.5"><Globe size={10} />Publicado</span>
              ) : (
                <span className="badge badge-yellow py-0.5"><Circle size={10} />Rascunho</span>
              )}
              <span className="text-[10px] text-ink-5">
                <Clock size={9} className="inline mr-0.5" />
                {new Date(project.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(`/editor/${project.id}`)}
          className="btn-secondary w-full h-8 text-xs">
          Editar projeto
        </button>
      </div>
    </div>
  )
}

export default function Dashboard({ user, profile }) {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const stats = [
    { label: 'Marcas ativas', value: projects.length, icon: FolderOpen ?? Layers },
    { label: 'Publicados', value: projects.filter(p => p.is_published).length, icon: Globe },
    { label: 'Rascunhos', value: projects.filter(p => !p.is_published).length, icon: FileText },
    { label: 'Downloads', value: 0, icon: Download },
  ]

  useEffect(() => {
    loadProjects()
  }, [user.id])

  async function loadProjects() {
    const { data } = await supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este projeto permanentemente?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function handleCreated(project) {
    setShowModal(false)
    navigate(`/editor/${project.id}`)
  }

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar profile={profile} />

      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-surface-0/80 backdrop-blur-sm border-b border-surface-3 px-8 py-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-5" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full max-w-xs bg-surface-2 border border-surface-4 rounded-xl pl-9 pr-4 py-2 text-sm text-ink-2 placeholder:text-ink-5 focus:outline-none focus:border-surface-5 transition-colors"
              placeholder="Buscar projetos..." />
          </div>
          <button className="btn-ghost relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{profile?.workspace_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}</span>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="section-title">Dashboard</h1>
              <p className="text-sm text-ink-4 mt-1">
                Olá, {profile?.workspace_name || user.email?.split('@')[0]}!
              </p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary h-10">
              <Plus size={16} /> Novo projeto
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Marcas ativas', value: projects.length, color: 'text-blue-400' },
              { label: 'Publicados', value: projects.filter(p => p.is_published).length, color: 'text-emerald-400' },
              { label: 'Rascunhos', value: projects.filter(p => !p.is_published).length, color: 'text-amber-400' },
              { label: 'Downloads', value: 0, color: 'text-violet-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-5">
                <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                <p className="text-xs text-ink-4 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-ink-1 text-lg">Projetos</h2>
              {projects.length > 0 && (
                <span className="text-xs text-ink-5">{filtered.length} projeto{filtered.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="card">
                    <div className="h-32 bg-surface-3 animate-pulse rounded-t-2xl" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-surface-3 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-surface-3 rounded animate-pulse w-1/2" />
                      <div className="h-8 bg-surface-3 rounded-lg animate-pulse mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="border-2 border-dashed border-surface-4 rounded-2xl p-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
                  <Layers size={20} className="text-ink-4" />
                </div>
                <p className="text-ink-3 font-medium mb-1">{search ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}</p>
                <p className="text-sm text-ink-5 mb-6">{search ? 'Tente outro termo de busca' : 'Crie seu primeiro projeto de marca'}</p>
                {!search && (
                  <button onClick={() => setShowModal(true)} className="btn-primary">
                    <Plus size={16} /> Criar projeto
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map(p => (
                  <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
                ))}
                {/* Add card */}
                <button onClick={() => setShowModal(true)}
                  className="card border-dashed hover:border-accent/40 hover:bg-surface-3/30 transition-all flex flex-col items-center justify-center gap-3 p-8 text-ink-5 hover:text-ink-3 min-h-[200px]">
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
                    <Plus size={18} />
                  </div>
                  <span className="text-sm font-medium">Novo projeto</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onCreated={handleCreated} userId={user.id} />}
    </div>
  )
}
