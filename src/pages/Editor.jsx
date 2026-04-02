import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  ArrowLeft, Save, Globe, Eye, EyeOff, Plus, X, Copy, Check,
  ChevronDown, Image, Type, Palette, FileText, Library,
  Monitor, Smartphone, CheckCircle, AlertCircle, Link2, Layers,
  Camera, MessageSquare, Cpu, Upload
} from 'lucide-react'

const MODULES = [
  { id: 'capa', label: 'Capa / Hero', icon: Monitor },
  { id: 'sobre', label: 'Sobre a marca', icon: FileText },
  { id: 'logotipo', label: 'Logotipo', icon: Image },
  { id: 'cores', label: 'Paleta de cores', icon: Palette },
  { id: 'tipografia', label: 'Tipografia', icon: Type },
  { id: 'elementos', label: 'Elementos gráficos', icon: Layers },
  { id: 'fotografia', label: 'Dir. fotográfica', icon: Camera },
  { id: 'voz', label: 'Tom de voz', icon: MessageSquare },
  { id: 'aplicacoes', label: 'Aplicações', icon: Cpu },
  { id: 'arquivos', label: 'Biblioteca de arquivos', icon: Library },
]

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6)
}

// ── MODULE EDITORS ────────────────────────────────────────────────

function CapaEditor({ data, onChange, project }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Nome da marca</label>
        <input value={data.name || project?.name || ''} onChange={e => onChange({ ...data, name: e.target.value })}
          className="input-field" placeholder="Nome da marca" />
      </div>
      <div>
        <label className="label">Tagline</label>
        <input value={data.tagline || ''} onChange={e => onChange({ ...data, tagline: e.target.value })}
          className="input-field" placeholder="Slogan ou tagline" />
      </div>
      <div>
        <label className="label">Imagem de capa</label>
        <div className="border-2 border-dashed border-surface-5 rounded-xl p-4 text-center">
          <Upload size={18} className="mx-auto mb-2 text-ink-4" />
          <p className="text-xs text-ink-4">Upload de imagem de capa</p>
          <p className="text-[10px] text-ink-5 mt-1">PNG, JPG · Recomendado 1920×600</p>
        </div>
      </div>
      <div>
        <label className="label">Logo destaque</label>
        <div className="border-2 border-dashed border-surface-5 rounded-xl p-4 text-center">
          <Upload size={18} className="mx-auto mb-2 text-ink-4" />
          <p className="text-xs text-ink-4">Upload do logo em destaque</p>
        </div>
      </div>
    </div>
  )
}

function SobreEditor({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Sobre a marca</label>
        <textarea value={data.about || ''} onChange={e => onChange({ ...data, about: e.target.value })} rows={5}
          className="input-field resize-none" placeholder="Conte a história e essência da marca..." />
      </div>
      <div>
        <label className="label">Missão</label>
        <textarea value={data.mission || ''} onChange={e => onChange({ ...data, mission: e.target.value })} rows={3}
          className="input-field resize-none" placeholder="A missão da marca..." />
      </div>
      <div>
        <label className="label">Visão</label>
        <textarea value={data.vision || ''} onChange={e => onChange({ ...data, vision: e.target.value })} rows={3}
          className="input-field resize-none" placeholder="A visão da marca..." />
      </div>
      <div>
        <label className="label">Valores</label>
        <textarea value={data.values || ''} onChange={e => onChange({ ...data, values: e.target.value })} rows={3}
          className="input-field resize-none" placeholder="Os valores que guiam a marca..." />
      </div>
    </div>
  )
}

function LogotipoEditor({ data, onChange, projectId, userId }) {
  const [uploading, setUploading] = useState(null)

  async function handleUpload(e, key) {
    const file = e.target.files[0]; if (!file) return
    setUploading(key)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${projectId}/${key}-${Date.now()}.${ext}`
    await supabase.storage.from('logos').upload(path, file)
    const { data: pub } = supabase.storage.from('logos').getPublicUrl(path)
    onChange({ ...data, [key]: pub.publicUrl })
    setUploading(null)
  }

  const logos = [
    { key: 'principal', label: 'Logo principal' },
    { key: 'horizontal', label: 'Versão horizontal' },
    { key: 'icone', label: 'Ícone / símbolo' },
    { key: 'negativo', label: 'Versão negativa' },
  ]

  return (
    <div className="space-y-4">
      {logos.map(({ key, label }) => (
        <div key={key}>
          <label className="label">{label}</label>
          <div className={`border-2 border-dashed rounded-xl transition-colors ${data[key] ? 'border-surface-5 bg-surface-3' : 'border-surface-4 hover:border-surface-5'}`}>
            {data[key] ? (
              <div className="relative p-3">
                <img src={data[key]} alt={label} className="h-16 mx-auto object-contain" />
                <button onClick={() => onChange({ ...data, [key]: null })}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-surface-4 flex items-center justify-center text-ink-4 hover:text-red-400">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center p-4 cursor-pointer">
                {uploading === key ? (
                  <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Upload size={16} className="text-ink-4 mb-1" />
                    <span className="text-xs text-ink-4">Enviar {label.toLowerCase()}</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, key)} />
              </label>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function CoresEditor({ data, onChange }) {
  const colors = data.colors || []

  function addColor() {
    onChange({ ...data, colors: [...colors, { name: '', hex: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), usage: '' }] })
  }
  function updateColor(i, field, val) {
    onChange({ ...data, colors: colors.map((c, idx) => idx === i ? { ...c, [field]: val } : c) })
  }
  function removeColor(i) {
    onChange({ ...data, colors: colors.filter((_, idx) => idx !== i) })
  }
  function copyHex(hex) {
    navigator.clipboard.writeText(hex)
  }

  return (
    <div className="space-y-3">
      {colors.map((c, i) => (
        <div key={i} className="bg-surface-3 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input type="color" value={c.hex || '#000000'} onChange={e => updateColor(i, 'hex', e.target.value)}
              className="w-10 h-10 rounded-lg border-2 border-surface-5 cursor-pointer p-1 flex-shrink-0 bg-transparent" />
            <input value={c.hex || ''} onChange={e => updateColor(i, 'hex', e.target.value)}
              className="w-28 bg-surface-2 border border-surface-5 rounded-lg px-2.5 py-2 text-xs font-mono text-ink-2 focus:outline-none focus:border-accent/50" />
            <button onClick={() => copyHex(c.hex)} className="btn-ghost p-1.5 ml-auto"><Copy size={12} /></button>
            <button onClick={() => removeColor(i)} className="btn-ghost p-1.5 text-red-400/60 hover:text-red-400"><X size={12} /></button>
          </div>
          <input value={c.name || ''} onChange={e => updateColor(i, 'name', e.target.value)}
            className="w-full bg-surface-2 border border-surface-5 rounded-lg px-2.5 py-2 text-xs text-ink-2 focus:outline-none focus:border-accent/50"
            placeholder="Nome da cor (ex: Azul primário)" />
          <input value={c.usage || ''} onChange={e => updateColor(i, 'usage', e.target.value)}
            className="w-full bg-surface-2 border border-surface-5 rounded-lg px-2.5 py-2 text-xs text-ink-2 focus:outline-none focus:border-accent/50"
            placeholder="Uso (ex: Elementos principais, CTA)" />
        </div>
      ))}
      <button onClick={addColor}
        className="w-full border border-dashed border-surface-5 rounded-xl py-2.5 text-xs text-ink-4 hover:border-accent/40 hover:text-accent transition-colors flex items-center justify-center gap-1.5">
        <Plus size={13} /> Adicionar cor
      </button>
    </div>
  )
}

function TipografiaEditor({ data, onChange }) {
  const fonts = data.fonts || [{}]

  function updateFont(i, field, val) {
    const updated = fonts.map((f, idx) => idx === i ? { ...f, [field]: val } : f)
    onChange({ ...data, fonts: updated })
  }
  function addFont() { onChange({ ...data, fonts: [...fonts, {}] }) }
  function removeFont(i) { onChange({ ...data, fonts: fonts.filter((_, idx) => idx !== i) }) }

  return (
    <div className="space-y-3">
      {fonts.map((f, i) => (
        <div key={i} className="bg-surface-3 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-ink-4 font-medium">Fonte {i + 1}</span>
            {fonts.length > 1 && <button onClick={() => removeFont(i)} className="text-ink-5 hover:text-red-400"><X size={12} /></button>}
          </div>
          <input value={f.name || ''} onChange={e => updateFont(i, 'name', e.target.value)}
            className="w-full bg-surface-2 border border-surface-5 rounded-lg px-2.5 py-2 text-sm text-ink-2 focus:outline-none focus:border-accent/50"
            placeholder="Nome da fonte (ex: Syne)" />
          <div className="grid grid-cols-2 gap-2">
            <input value={f.category || ''} onChange={e => updateFont(i, 'category', e.target.value)}
              className="bg-surface-2 border border-surface-5 rounded-lg px-2.5 py-2 text-xs text-ink-2 focus:outline-none focus:border-accent/50"
              placeholder="Categoria (Título, Corpo...)" />
            <input value={f.weight || ''} onChange={e => updateFont(i, 'weight', e.target.value)}
              className="bg-surface-2 border border-surface-5 rounded-lg px-2.5 py-2 text-xs text-ink-2 focus:outline-none focus:border-accent/50"
              placeholder="Pesos (400, 600, 700)" />
          </div>
          <textarea value={f.description || ''} onChange={e => updateFont(i, 'description', e.target.value)} rows={2}
            className="w-full bg-surface-2 border border-surface-5 rounded-lg px-2.5 py-2 text-xs text-ink-2 focus:outline-none focus:border-accent/50 resize-none"
            placeholder="Onde e como usar esta fonte..." />
        </div>
      ))}
      <button onClick={addFont}
        className="w-full border border-dashed border-surface-5 rounded-xl py-2.5 text-xs text-ink-4 hover:border-accent/40 hover:text-accent transition-colors flex items-center justify-center gap-1.5">
        <Plus size={13} /> Adicionar fonte
      </button>
    </div>
  )
}

function GenericTextEditor({ data, onChange, fields }) {
  return (
    <div className="space-y-4">
      {fields.map(({ key, label, placeholder, rows = 3 }) => (
        <div key={key}>
          <label className="label">{label}</label>
          <textarea value={data[key] || ''} onChange={e => onChange({ ...data, [key]: e.target.value })} rows={rows}
            className="input-field resize-none" placeholder={placeholder} />
        </div>
      ))}
    </div>
  )
}

function ArquivosEditor({ data, onChange, projectId, userId }) {
  const [uploading, setUploading] = useState(false)
  const files = data.files || []

  async function handleUpload(e) {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    const path = `${userId}/${projectId}/files/${Date.now()}-${file.name}`
    await supabase.storage.from('assets').upload(path, file)
    const { data: pub } = supabase.storage.from('assets').getPublicUrl(path)
    onChange({ ...data, files: [...files, { name: file.name, url: pub.publicUrl, size: file.size, type: file.type }] })
    setUploading(false)
    e.target.value = ''
  }

  function removeFile(i) {
    onChange({ ...data, files: files.filter((_, idx) => idx !== i) })
  }

  function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1048576).toFixed(1)}MB`
  }

  return (
    <div className="space-y-3">
      <label className="flex flex-col items-center p-5 border-2 border-dashed border-surface-5 rounded-xl cursor-pointer hover:border-accent/40 transition-colors">
        {uploading ? (
          <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        ) : (
          <>
            <Upload size={20} className="text-ink-4 mb-2" />
            <p className="text-sm text-ink-4">Arraste arquivos ou clique para enviar</p>
            <p className="text-xs text-ink-5 mt-1">PDF, PNG, SVG, AI, ZIP · Máx 50MB</p>
          </>
        )}
        <input type="file" className="hidden" onChange={handleUpload} multiple />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface-3 rounded-xl px-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-ink-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink-2 truncate">{f.name}</p>
                <p className="text-[10px] text-ink-5">{formatSize(f.size)}</p>
              </div>
              <button onClick={() => removeFile(i)} className="text-ink-5 hover:text-red-400 flex-shrink-0"><X size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── PREVIEW ──────────────────────────────────────────────────────

function Preview({ project, contents, activeModule }) {
  const capa = contents.capa || {}
  const sobre = contents.sobre || {}
  const logotipo = contents.logotipo || {}
  const cores = contents.cores || {}
  const tipografia = contents.tipografia || {}
  const voz = contents.voz || {}
  const arquivos = contents.arquivos || {}

  const brandName = capa.name || project?.name || 'Nome da Marca'
  const primaryColor = cores.colors?.[0]?.hex || '#6366f1'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl text-gray-900 min-h-full">
      {/* Hero */}
      <div className="relative" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}>
        <div className="px-8 py-10">
          {(logotipo.principal || project?.logo_url) && (
            <img src={logotipo.principal || project?.logo_url} alt={brandName} className="h-10 mb-6 object-contain" />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            {brandName}
          </h1>
          {capa.tagline && <p className="text-gray-500 text-base">{capa.tagline}</p>}
        </div>
        {activeModule === 'capa' && <div className="absolute inset-0 ring-2 ring-indigo-400 ring-inset rounded-t-2xl pointer-events-none" />}
      </div>

      {/* Sobre */}
      {sobre.about && (
        <div className={`px-8 py-6 border-b border-gray-100 relative ${activeModule === 'sobre' ? 'ring-2 ring-indigo-400 ring-inset' : ''}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Sobre</p>
          <p className="text-sm text-gray-600 leading-relaxed">{sobre.about}</p>
        </div>
      )}

      {/* Logos */}
      {(logotipo.principal || logotipo.horizontal || logotipo.icone) && (
        <div className={`px-8 py-6 border-b border-gray-100 relative ${activeModule === 'logotipo' ? 'ring-2 ring-indigo-400 ring-inset' : ''}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Logotipo</p>
          <div className="flex flex-wrap gap-4">
            {[logotipo.principal, logotipo.horizontal, logotipo.icone, logotipo.negativo].filter(Boolean).map((url, i) => (
              <div key={i} className={`${i === 3 ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 flex items-center justify-center`}
                style={{ minWidth: 80, minHeight: 60 }}>
                <img src={url} alt="" className="h-10 object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cores */}
      {(cores.colors || []).length > 0 && (
        <div className={`px-8 py-6 border-b border-gray-100 relative ${activeModule === 'cores' ? 'ring-2 ring-indigo-400 ring-inset' : ''}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Paleta de cores</p>
          <div className="flex flex-wrap gap-3">
            {(cores.colors || []).map((c, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-xl shadow-sm mb-1.5" style={{ background: c.hex }} />
                <p className="text-[10px] font-medium text-gray-700">{c.name || 'Cor'}</p>
                <p className="text-[10px] font-mono text-gray-400">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tipografia */}
      {(tipografia.fonts || []).length > 0 && (
        <div className={`px-8 py-6 border-b border-gray-100 relative ${activeModule === 'tipografia' ? 'ring-2 ring-indigo-400 ring-inset' : ''}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Tipografia</p>
          {(tipografia.fonts || []).map((f, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <p className="text-xl font-bold text-gray-900" style={{ fontFamily: f.name }}>
                  {f.name || 'Fonte'}
                </p>
                {f.category && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{f.category}</span>}
              </div>
              {f.description && <p className="text-xs text-gray-400">{f.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Tom de voz */}
      {voz.voice && (
        <div className={`px-8 py-6 border-b border-gray-100 relative ${activeModule === 'voz' ? 'ring-2 ring-indigo-400 ring-inset' : ''}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Tom de voz</p>
          <p className="text-sm text-gray-600 leading-relaxed">{voz.voice}</p>
        </div>
      )}

      {/* Arquivos */}
      {(arquivos.files || []).length > 0 && (
        <div className={`px-8 py-6 relative ${activeModule === 'arquivos' ? 'ring-2 ring-indigo-400 ring-inset' : ''}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Downloads</p>
          <div className="space-y-2">
            {(arquivos.files || []).map((f, i) => (
              <a key={i} href={f.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-gray-400" />
                </div>
                <span className="text-sm text-gray-700 flex-1 truncate">{f.name}</span>
                <span className="text-xs text-gray-400 group-hover:text-indigo-500">↓</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!sobre.about && (cores.colors || []).length === 0 && (tipografia.fonts || []).every(f => !f.name) && (
        <div className="px-8 py-12 text-center text-gray-400">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Eye size={20} className="text-gray-300" />
          </div>
          <p className="text-sm">O preview aparece aqui conforme você preenche os módulos</p>
        </div>
      )}
    </div>
  )
}

// ── MAIN EDITOR ───────────────────────────────────────────────────

export default function Editor({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [contents, setContents] = useState({})
  const [activeModule, setActiveModule] = useState('capa')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'saved' | 'error'
  const [publishing, setPublishing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase.from('projects').select('*').eq('id', id).eq('user_id', user.id).single()
      if (!proj) { navigate('/dashboard'); return }
      setProject(proj)
      const { data: rows } = await supabase.from('project_content').select('*').eq('project_id', id)
      const map = {}
      for (const row of (rows || [])) map[row.section] = row.content
      setContents(map)
      setLoading(false)
    }
    load()
  }, [id, user.id])

  function updateModule(section, data) {
    setContents(prev => ({ ...prev, [section]: data }))
  }

  async function handleSave() {
    setSaving(true)
    setSaveStatus(null)
    try {
      const SECTIONS = MODULES.map(m => m.id)
      for (const section of SECTIONS) {
        await supabase.from('project_content').upsert(
          { project_id: id, section, content: contents[section] || {} },
          { onConflict: 'project_id,section' }
        )
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    setPublishing(true)
    await handleSave()
    const slugVal = project.slug || generateSlug(project.name)
    const { data } = await supabase.from('projects').update({ is_published: true, slug: slugVal }).eq('id', id).select().single()
    setProject(data)
    setPublishing(false)
    setShowPublishDialog(true)
  }

  async function handleUnpublish() {
    await supabase.from('projects').update({ is_published: false }).eq('id', id)
    setProject(p => ({ ...p, is_published: false }))
  }

  function copyPortalLink() {
    navigator.clipboard.writeText(`${window.location.origin}/p/${project.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function renderEditor() {
    const data = contents[activeModule] || {}
    const onChange = d => updateModule(activeModule, d)
    switch (activeModule) {
      case 'capa': return <CapaEditor data={data} onChange={onChange} project={project} />
      case 'sobre': return <SobreEditor data={data} onChange={onChange} />
      case 'logotipo': return <LogotipoEditor data={data} onChange={onChange} projectId={id} userId={user.id} />
      case 'cores': return <CoresEditor data={data} onChange={onChange} />
      case 'tipografia': return <TipografiaEditor data={data} onChange={onChange} />
      case 'elementos': return <GenericTextEditor data={data} onChange={onChange} fields={[
        { key: 'description', label: 'Descrição dos elementos', placeholder: 'Ícones, ilustrações, padrões...', rows: 4 },
        { key: 'usage', label: 'Como usar', placeholder: 'Regras de uso dos elementos gráficos...', rows: 3 },
      ]} />
      case 'fotografia': return <GenericTextEditor data={data} onChange={onChange} fields={[
        { key: 'style', label: 'Estilo fotográfico', placeholder: 'Descreva o estilo visual...', rows: 4 },
        { key: 'dont', label: 'O que evitar', placeholder: 'Estilos, composições ou situações a evitar...', rows: 3 },
      ]} />
      case 'voz': return <GenericTextEditor data={data} onChange={onChange} fields={[
        { key: 'voice', label: 'Tom de voz', placeholder: 'Como a marca se comunica...', rows: 4 },
        { key: 'examples', label: 'Exemplos', placeholder: 'Exemplos de copy e mensagens...', rows: 4 },
        { key: 'avoid', label: 'Evitar', placeholder: 'Palavras e abordagens a evitar...', rows: 3 },
      ]} />
      case 'aplicacoes': return <GenericTextEditor data={data} onChange={onChange} fields={[
        { key: 'digital', label: 'Aplicações digitais', placeholder: 'Website, redes sociais, e-mail...', rows: 3 },
        { key: 'print', label: 'Aplicações físicas', placeholder: 'Cartão, embalagem, papelaria...', rows: 3 },
        { key: 'notes', label: 'Observações', placeholder: 'Regras especiais de aplicação...', rows: 3 },
      ]} />
      case 'arquivos': return <ArquivosEditor data={data} onChange={onChange} projectId={id} userId={user.id} />
      default: return null
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  )

  const portalUrl = `${window.location.origin}/p/${project?.slug}`

  return (
    <div className="h-screen bg-surface-0 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="bg-surface-1 border-b border-surface-3 px-5 py-3 flex items-center gap-4 flex-shrink-0">
        <Link to="/dashboard" className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </Link>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">B</span>
          </div>
          <span className="text-ink-4 text-sm">/</span>
          <span className="text-sm font-medium text-ink-2 truncate">{project?.name}</span>
          {project?.is_published && (
            <span className="badge-green badge py-0.5 flex-shrink-0"><Globe size={10} />Publicado</span>
          )}
        </div>

        {/* Preview toggle */}
        <div className="hidden md:flex items-center bg-surface-3 rounded-lg p-0.5">
          <button onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-surface-4 text-ink-1' : 'text-ink-4 hover:text-ink-3'}`}>
            <Monitor size={15} />
          </button>
          <button onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-surface-4 text-ink-1' : 'text-ink-4 hover:text-ink-3'}`}>
            <Smartphone size={15} />
          </button>
        </div>

        {/* Save status */}
        {saveStatus === 'saved' && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
            <CheckCircle size={14} /> Salvo
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs">
            <AlertCircle size={14} /> Erro ao salvar
          </div>
        )}

        {project?.is_published && project?.slug && (
          <a href={portalUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs gap-1.5 hidden md:flex">
            <ExternalLink size={14} /> Ver portal
          </a>
        )}

        {project?.is_published ? (
          <button onClick={handleUnpublish} className="btn-secondary h-9 text-xs">Despublicar</button>
        ) : (
          <button onClick={handlePublish} disabled={publishing}
            className="h-9 px-4 rounded-xl bg-emerald-500/90 text-white text-xs font-medium hover:bg-emerald-500 transition-colors disabled:opacity-60 flex items-center gap-1.5">
            {publishing ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Globe size={14} />}
            Publicar portal
          </button>
        )}

        <button onClick={handleSave} disabled={saving}
          className="btn-primary h-9 text-xs gap-1.5">
          {saving ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={14} />}
          Salvar
        </button>
      </header>

      {/* 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left - Module nav */}
        <aside className="w-52 bg-surface-1 border-r border-surface-3 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="px-3 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-5 px-3 mb-2">Módulos</p>
            <nav className="space-y-0.5">
              {MODULES.map(({ id: mid, label, icon: Icon }) => (
                <button key={mid} onClick={() => setActiveModule(mid)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeModule === mid
                      ? 'bg-surface-3 text-ink-1 font-medium'
                      : 'text-ink-4 hover:bg-surface-2 hover:text-ink-3'
                  }`}>
                  <Icon size={14} className="flex-shrink-0" />
                  <span className="truncate">{label}</span>
                  {contents[mid] && Object.keys(contents[mid]).some(k => {
                    const v = contents[mid][k]
                    return Array.isArray(v) ? v.length > 0 : !!v
                  }) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 ml-auto" />
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-6 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-5 mb-2">Configs visuais</p>
              <div className="bg-surface-2 border border-surface-4 rounded-xl p-3 space-y-2">
                <div>
                  <p className="text-[10px] text-ink-5 mb-1">Cor principal</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded" style={{ background: contents.cores?.colors?.[0]?.hex || '#6366f1' }} />
                    <span className="text-xs font-mono text-ink-4">{contents.cores?.colors?.[0]?.hex || '#6366f1'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User */}
          <div className="mt-auto px-3 py-3 border-t border-surface-3">
            <div className="flex items-center gap-2 px-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-bold">{user.email?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-ink-4 truncate">{user.email}</p>
                <p className="text-[9px] text-ink-5">Plano Free</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Preview */}
        <main className="flex-1 bg-surface-0 overflow-y-auto preview-scroll p-6 hidden md:block">
          <div className={`mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
            <div className="text-center mb-4">
              <span className="text-[10px] text-ink-5 uppercase tracking-widest">Preview do portal</span>
            </div>
            <Preview project={project} contents={contents} activeModule={activeModule} />
          </div>
        </main>

        {/* Right - Editor panel */}
        <aside className="w-80 bg-surface-1 border-l border-surface-3 flex flex-col flex-shrink-0">
          <div className="px-5 py-4 border-b border-surface-3">
            <div className="flex items-center gap-2">
              {React.createElement(MODULES.find(m => m.id === activeModule)?.icon || FileText, { size: 15, className: 'text-ink-3' })}
              <h2 className="text-sm font-semibold text-ink-1">
                {MODULES.find(m => m.id === activeModule)?.label}
              </h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {renderEditor()}
          </div>
        </aside>
      </div>

      {/* Publish success dialog */}
      {showPublishDialog && project?.is_published && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-2 border border-surface-4 rounded-2xl w-full max-w-md p-6 animate-slide-up">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Globe size={24} className="text-emerald-400" />
              </div>
              <h2 className="font-display font-bold text-ink-1 text-xl mb-2">Portal publicado! 🎉</h2>
              <p className="text-sm text-ink-4">Seu portal está online e pronto para compartilhar</p>
            </div>
            <div className="bg-surface-3 border border-surface-5 rounded-xl flex items-center gap-2 p-3 mb-5">
              <Link2 size={14} className="text-ink-4 flex-shrink-0" />
              <span className="text-xs font-mono text-ink-3 flex-1 truncate">{portalUrl}</span>
              <button onClick={copyPortalLink} className="btn-ghost p-1.5 text-xs gap-1">
                {copied ? <><Check size={12} className="text-emerald-400" /> Copiado</> : <><Copy size={12} /> Copiar</>}
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPublishDialog(false)} className="btn-secondary flex-1 h-10 text-sm">Fechar</button>
              <a href={portalUrl} target="_blank" rel="noreferrer" className="btn-primary flex-1 h-10 text-sm flex items-center justify-center gap-1.5">
                <ExternalLink size={14} /> Ver portal
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
