import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SECTIONS = ['capa','logotipo','cores','tipografia','textos','arquivos']
const LABELS = { capa:'Capa', logotipo:'Logotipo', cores:'Cores', tipografia:'Tipografia', textos:'Textos', arquivos:'Arquivos' }
function slug(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '-' + Math.random().toString(36).slice(2,7) }

function CapaEditor({ data, onChange, project }) {
  return <div className="space-y-4">
    <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Nome da marca</label><input value={data.name||project?.name||''} onChange={e=>onChange({...data,name:e.target.value})} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" placeholder="Nome" /></div>
    <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Descrição</label><textarea value={data.description||''} onChange={e=>onChange({...data,description:e.target.value})} rows={3} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Breve descrição..." /></div>
  </div>
}
function LogotipoEditor({ data, onChange, projectId, userId }) {
  const [uploading, setUploading] = useState(false)
  async function handleUpload(e, key) {
    const file = e.target.files[0]; if (!file) return; setUploading(true)
    const ext = file.name.split('.').pop()
    const path = userId+'/'+projectId+'/'+key+'-'+Date.now()+'.'+ext
    await supabase.storage.from('logos').upload(path, file)
    const { data: pub } = supabase.storage.from('logos').getPublicUrl(path)
    onChange({...data,[key]:pub.publicUrl}); setUploading(false)
  }
  return <div className="space-y-4">
    {['principal','variacao1','variacao2'].map((key,i) => <div key={key}>
      <label className="block text-xs font-medium uppercase tracking-wider mb-1.5">{i===0?'Logo principal':'Variação '+i}</label>
      {data[key] && <img src={data[key]} alt="" className="w-full h-20 object-contain bg-neutral-50 rounded-lg mb-2" />}
      <input type="file" accept="image/*" onChange={e=>handleUpload(e,key)} disabled={uploading} className="w-full text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-neutral-100 file:text-neutral-800 cursor-pointer" />
    </div>)}
    {uploading && <p className="text-xs text-neutral-400">Enviando...</p>}
  </div>
}
function CoresEditor({ data, onChange }) {
  const colors = data.colors || []
  function add() { onChange({...data, colors:[...colors,{name:'',hex:'#000000'}]}) }
  function upd(i,f,v) { onChange({...data, colors:colors.map((c,idx)=>idx===i?{...c,[f]:v}:c)}) }
  function rem(i) { onChange({...data, colors:colors.filter((_,idx)=>idx!==i)}) }
  return <div className="space-y-3">
    {colors.map((c,i) => <div key={i} className="flex items-center gap-2">
      <input type="color" value={c.hex||'#000000'} onChange={e=>upd(i,'hex',e.target.value)} className="w-9 h-9 rounded-lg border border-neutral-200 cursor-pointer p-0.5" />
      <input value={c.hex||''} onChange={e=>upd(i,'hex',e.target.value)} className="w-24 border border-neutral-200 rounded-lg px-2 py-2 text-xs font-mono focus:outline-none focus:border-blue-500" placeholder="#000000" />
      <input value={c.name||''} onChange={e=>upd(i,'name',e.target.value)} className="flex-1 border border-neutral-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-blue-500" placeholder="Nome" />
      <button onClick={()=>rem(i)} className="text-neutral-300 hover:text-red-400 text-lg">×</button>
    </div>)}
    <button onClick={add} className="w-full border border-dashed border-neutral-200 rounded-lg py-2 text-xs text-neutral-400 hover:border-blue-400 hover:text-blue-600 transition-colors">+ Adicionar cor</button>
  </div>
}
function TipografiaEditor({ data, onChange }) {
  const fonts = data.fonts || [{}]
  function upd(i,f,v) { onChange({...data, fonts:fonts.map((ft,idx)=>idx===i?{...ft,[f]:v}:ft)}) }
  return <div className="space-y-4">
    {fonts.map((f,i) => <div key={i} className="space-y-2 p-3 bg-neutral-50 rounded-lg">
      <input value={f.name||''} onChange={e=>upd(i,'name',e.target.value)} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500" placeholder="Nome da fonte" />
      <input value={f.style||''} onChange={e=>upd(i,'style',e.target.value)} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500" placeholder="Estilo (Regular, Bold...)" />
      <textarea value={f.description||''} onChange={e=>upd(i,'description',e.target.value)} rows={2} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 resize-none" placeholder="Contexto de uso..." />
    </div>)}
    <button onClick={()=>onChange({...data,fonts:[...fonts,{}]})} className="w-full border border-dashed border-neutral-200 rounded-lg py-2 text-xs text-neutral-400 hover:border-blue-400 hover:text-blue-600 transition-colors">+ Adicionar fonte</button>
  </div>
}
function TextosEditor({ data, onChange }) {
  return <div className="space-y-4">
    <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Sobre a marca</label><textarea value={data.about||''} onChange={e=>onChange({...data,about:e.target.value})} rows={4} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Missão, valores..." /></div>
    <div><label className="block text-xs font-medium uppercase tracking-wider mb-1.5">Tom de voz</label><textarea value={data.voice||''} onChange={e=>onChange({...data,voice:e.target.value})} rows={3} className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Como a marca se comunica..." /></div>
  </div>
}
function ArquivosEditor({ data, onChange, projectId, userId }) {
  const [uploading, setUploading] = useState(false)
  const files = data.files || []
  async function handleUpload(e) {
    const file = e.target.files[0]; if (!file) return; setUploading(true)
    const path = userId+'/'+projectId+'/files/'+Date.now()+'-'+file.name
    await supabase.storage.from('assets').upload(path, file)
    const { data: pub } = supabase.storage.from('assets').getPublicUrl(path)
    onChange({...data, files:[...files,{name:file.name,url:pub.publicUrl}]}); setUploading(false); e.target.value=''
  }
  return <div className="space-y-3">
    <input type="file" onChange={handleUpload} disabled={uploading} className="w-full text-xs text-neutral-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-blue-600 file:text-white cursor-pointer" />
    {uploading && <p className="text-xs text-neutral-400">Enviando...</p>}
    {files.map((f,i) => <div key={i} className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2"><span className="text-xs flex-1 truncate">{f.name}</span><button onClick={()=>onChange({...data,files:files.filter((_,idx)=>idx!==i)})} className="text-neutral-300 hover:text-red-400 text-lg">×</button></div>)}
  </div>
}

export default function Editor({ user }) {
  const { id } = useParams(); const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [contents, setContents] = useState({})
  const [active, setActive] = useState('capa')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase.from('projects').select('*').eq('id', id).eq('user_id', user.id).single()
      if (!proj) { navigate('/dashboard'); return }
      setProject(proj)
      const { data: rows } = await supabase.from('project_content').select('*').eq('project_id', id)
      const map = {}; for (const r of (rows||[])) map[r.section]=r.content
      setContents(map); setLoading(false)
    }
    load()
  }, [id, user.id])

  function update(section, data) { setContents(prev => ({...prev, [section]: data})) }

  async function save() {
    setSaving(true)
    for (const section of SECTIONS) {
      await supabase.from('project_content').upsert({ project_id: id, section, content: contents[section]||{} }, { onConflict: 'project_id,section' })
    }
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2000)
  }

  async function publish() {
    await save()
    const s = project.slug || slug(project.name)
    const { data } = await supabase.from('projects').update({ is_published: true, slug: s }).eq('id', id).select().single()
    setProject(data)
  }

  async function unpublish() {
    await supabase.from('projects').update({ is_published: false }).eq('id', id)
    setProject(p => ({...p, is_published: false}))
  }

  function renderEditor() {
    const data = contents[active] || {}
    const onChange = d => update(active, d)
    switch(active) {
      case 'capa': return <CapaEditor data={data} onChange={onChange} project={project} />
      case 'logotipo': return <LogotipoEditor data={data} onChange={onChange} projectId={id} userId={user.id} />
      case 'cores': return <CoresEditor data={data} onChange={onChange} />
      case 'tipografia': return <TipografiaEditor data={data} onChange={onChange} />
      case 'textos': return <TextosEditor data={data} onChange={onChange} />
      case 'arquivos': return <ArquivosEditor data={data} onChange={onChange} projectId={id} userId={user.id} />
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-neutral-400">Carregando...</div>

  const capa = contents.capa||{}; const cores = contents.cores||{}; const tipografia = contents.tipografia||{}
  const textos = contents.textos||{}; const logotipo = contents.logotipo||{}; const arquivos = contents.arquivos||{}

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center gap-3 z-10">
        <Link to="/dashboard" className="text-neutral-400 hover:text-neutral-800 text-sm">←</Link>
        <div className="flex-1 min-w-0"><h1 className="text-sm font-medium truncate">{project?.name}</h1></div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {project?.is_published && project?.slug && <a href={'/p/'+project.slug} target="_blank" rel="noreferrer" className="text-xs text-neutral-400 border border-neutral-200 rounded-lg px-3 py-1.5 hover:bg-neutral-50 hidden sm:block">Ver portal ↗</a>}
          {project?.is_published ? <button onClick={unpublish} className="text-xs border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-500 hover:bg-neutral-50">Despublicar</button> : <button onClick={publish} className="text-xs bg-green-600 text-white rounded-lg px-3 py-1.5 hover:bg-green-700">Publicar</button>}
          <button onClick={save} disabled={saving} className="text-xs bg-neutral-900 text-white rounded-lg px-3 py-1.5 hover:bg-neutral-700 disabled:opacity-60">{saving?'Salvando...':saved?'✓ Salvo':'Salvar'}</button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-40 bg-white border-r border-neutral-200 flex-shrink-0">
          <nav className="p-2 space-y-0.5">
            {SECTIONS.map(s => <button key={s} onClick={()=>setActive(s)} className={"w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors "+(active===s?'bg-blue-600 text-white font-medium':'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800')}>{LABELS[s]}</button>)}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-6 hidden md:block">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden max-w-lg mx-auto">
            <div className="bg-neutral-900 px-5 py-4 flex items-center gap-3">
              {(logotipo.principal||project?.logo_url) && <img src={logotipo.principal||project?.logo_url} alt="" className="h-7 w-7 object-contain" />}
              <span className="text-white text-sm font-medium">{capa.name||project?.name}</span>
            </div>
            <div className="p-5 space-y-5 text-sm">
              {capa.description && <p className="text-neutral-500 text-xs">{capa.description}</p>}
              {(cores.colors||[]).length>0 && <div><p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Cores</p><div className="flex flex-wrap gap-2">{(cores.colors||[]).map((c,i)=><div key={i} className="flex items-center gap-1"><div className="w-5 h-5 rounded" style={{background:c.hex}} /><span className="text-xs font-mono text-neutral-400">{c.hex}</span></div>)}</div></div>}
              {(tipografia.fonts||[]).length>0 && <div><p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Tipografia</p>{(tipografia.fonts||[]).map((f,i)=><p key={i} className="text-xs"><span className="font-medium">{f.name}</span>{f.style&&<span className="text-neutral-400"> · {f.style}</span>}</p>)}</div>}
              {textos.about && <div><p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Sobre</p><p className="text-xs leading-relaxed">{textos.about}</p></div>}
              {(arquivos.files||[]).length>0 && <div><p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Arquivos</p>{(arquivos.files||[]).map((f,i)=><p key={i} className="text-xs text-blue-600">↓ {f.name}</p>)}</div>}
            </div>
          </div>
        </main>
        <aside className="w-72 bg-white border-l border-neutral-200 flex-shrink-0 overflow-y-auto">
          <div className="p-4"><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">{LABELS[active]}</h2>{renderEditor()}</div>
        </aside>
      </div>
    </div>
  )
}