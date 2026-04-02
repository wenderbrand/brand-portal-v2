import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function PublicPortal() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [contents, setContents] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(null)
  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase.from('projects').select('*').eq('slug', slug).eq('is_published', true).single()
      if (!proj) { setNotFound(true); setLoading(false); return }
      setProject(proj)
      const { data: rows } = await supabase.from('project_content').select('*').eq('project_id', proj.id)
      const map = {}
      for (const row of (rows || [])) map[row.section] = row.content
      setContents(map); setLoading(false)
    }
    load()
  }, [slug])
  function copyHex(hex, i) { navigator.clipboard.writeText(hex); setCopied(i); setTimeout(() => setCopied(null), 1500) }
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-neutral-400">Carregando...</div>
  if (notFound) return <div className="min-h-screen flex items-center justify-center text-center p-4"><div><p className="text-2xl mb-2">404</p><p className="text-sm text-neutral-400">Portal não encontrado.</p></div></div>
  const capa = contents.capa || {}
  const logotipo = contents.logotipo || {}
  const cores = contents.cores || {}
  const tipografia = contents.tipografia || {}
  const textos = contents.textos || {}
  const arquivos = contents.arquivos || {}
  const logo = logotipo.principal || project.logo_url
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-100 px-6 py-5 flex items-center gap-4">
        {logo && <img src={logo} alt={project.name} className="h-10 w-10 object-contain" />}
        <div><h1 className="text-lg font-semibold">{capa.name || project.name}</h1>{capa.description && <p className="text-sm text-neutral-500 mt-0.5">{capa.description}</p>}</div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {(logotipo.principal || logotipo.variacao1 || logotipo.variacao2) && (
          <section><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Logotipo</h2>
            <div className="flex flex-wrap gap-4">{[logotipo.principal, logotipo.variacao1, logotipo.variacao2].filter(Boolean).map((url, i) => <div key={i} className="bg-neutral-50 rounded-xl p-6 flex items-center justify-center"><img src={url} alt="" className="h-16 max-w-[160px] object-contain" /></div>)}</div>
          </section>
        )}
        {(cores.colors || []).length > 0 && (
          <section><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Cores</h2>
            <div className="flex flex-wrap gap-4">{(cores.colors || []).map((c, i) => <div key={i}><div className="w-20 h-20 rounded-xl mb-2 border border-neutral-100" style={{background: c.hex}} /><p className="text-xs font-medium">{c.name}</p><button onClick={() => copyHex(c.hex, i)} className="text-xs font-mono text-neutral-400 hover:text-blue-600 transition-colors">{copied === i ? 'Copiado!' : c.hex}</button></div>)}</div>
          </section>
        )}
        {(tipografia.fonts || []).length > 0 && (
          <section><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Tipografia</h2>
            <div className="space-y-4">{(tipografia.fonts || []).map((f, i) => <div key={i} className="border border-neutral-100 rounded-xl p-5"><p className="text-xl font-medium mb-1">{f.name}</p>{f.style && <p className="text-sm text-neutral-400">{f.style}</p>}{f.description && <p className="text-sm text-neutral-500 mt-2">{f.description}</p>}</div>)}</div>
          </section>
        )}
        {(textos.about || textos.voice) && (
          <section className="space-y-6">
            {textos.about && <div><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Sobre</h2><p className="text-sm leading-relaxed whitespace-pre-wrap">{textos.about}</p></div>}
            {textos.voice && <div><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Tom de voz</h2><p className="text-sm leading-relaxed whitespace-pre-wrap">{textos.voice}</p></div>}
          </section>
        )}
        {(arquivos.files || []).length > 0 && (
          <section><h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Arquivos</h2>
            <div className="space-y-2">{(arquivos.files || []).map((f, i) => <a key={i} href={f.url} target="_blank" rel="noreferrer" download className="flex items-center gap-3 border border-neutral-100 rounded-xl px-4 py-3 hover:border-blue-200 hover:bg-blue-50 transition-colors group"><span className="text-blue-600 text-lg">↓</span><span className="text-sm flex-1 truncate">{f.name}</span><span className="text-xs text-neutral-400 group-hover:text-blue-600">Download</span></a>)}</div>
          </section>
        )}
      </main>
      <footer className="border-t border-neutral-100 px-6 py-5 text-center"><span className="text-xs text-neutral-400">Feito com <span className="font-medium text-neutral-700">Brand Portal</span></span></footer>
    </div>
  )
}