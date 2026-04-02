import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Download, Copy, Check, ExternalLink } from 'lucide-react'

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
      setContents(map)
      setLoading(false)
    }
    load()
  }, [slug])

  function copyHex(hex, id) {
    navigator.clipboard.writeText(hex)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-800 animate-spin" />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-200 mb-4">404</p>
        <p className="text-gray-500">Portal não encontrado ou não está publicado.</p>
      </div>
    </div>
  )

  const capa = contents.capa || {}
  const sobre = contents.sobre || {}
  const logotipo = contents.logotipo || {}
  const cores = contents.cores || {}
  const tipografia = contents.tipografia || {}
  const elementos = contents.elementos || {}
  const fotografia = contents.fotografia || {}
  const voz = contents.voz || {}
  const aplicacoes = contents.aplicacoes || {}
  const arquivos = contents.arquivos || {}

  const brandName = capa.name || project.name
  const primaryColor = cores.colors?.[0]?.hex || '#111111'
  const logoUrl = logotipo.principal || project.logo_url

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}0a, ${primaryColor}03, #ffffff)` }}>
        {/* Nav */}
        <div className="border-b border-gray-100 px-8 py-5 flex items-center gap-4">
          {logoUrl && <img src={logoUrl} alt={brandName} className="h-8 object-contain" />}
          <h1 className="text-base font-semibold text-gray-900">{brandName}</h1>
          <div className="ml-auto">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              Feito com <span className="font-semibold text-gray-600">BrandPortal</span>
            </span>
          </div>
        </div>

        {/* Hero content */}
        <div className="px-8 py-16 max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            {brandName}
          </h2>
          {capa.tagline && (
            <p className="text-xl text-gray-500 max-w-xl leading-relaxed">{capa.tagline}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12 space-y-16">

        {/* Sobre */}
        {(sobre.about || sobre.mission) && (
          <section>
            <SectionTitle>Sobre a marca</SectionTitle>
            <div className="grid gap-6">
              {sobre.about && (
                <p className="text-gray-600 text-base leading-relaxed">{sobre.about}</p>
              )}
              {(sobre.mission || sobre.vision || sobre.values) && (
                <div className="grid md:grid-cols-3 gap-4">
                  {sobre.mission && <PillarCard title="Missão" text={sobre.mission} />}
                  {sobre.vision && <PillarCard title="Visão" text={sobre.vision} />}
                  {sobre.values && <PillarCard title="Valores" text={sobre.values} />}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Logotipos */}
        {(logotipo.principal || logotipo.horizontal || logotipo.icone || logotipo.negativo) && (
          <section>
            <SectionTitle>Logotipo</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { url: logotipo.principal, label: 'Principal', bg: 'bg-gray-50' },
                { url: logotipo.horizontal, label: 'Horizontal', bg: 'bg-gray-50' },
                { url: logotipo.icone, label: 'Ícone', bg: 'bg-gray-50' },
                { url: logotipo.negativo, label: 'Negativa', bg: 'bg-gray-900' },
              ].filter(l => l.url).map(({ url, label, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-6 flex flex-col items-center gap-3`}>
                  <img src={url} alt={label} className="h-12 object-contain" />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cores */}
        {(cores.colors || []).length > 0 && (
          <section>
            <SectionTitle>Paleta de cores</SectionTitle>
            <div className="flex flex-wrap gap-4">
              {(cores.colors || []).map((c, i) => (
                <div key={i} className="group">
                  <div className="w-20 h-20 rounded-2xl mb-3 shadow-sm border border-black/5" style={{ background: c.hex }} />
                  {c.name && <p className="text-sm font-semibold text-gray-800">{c.name}</p>}
                  <button onClick={() => copyHex(c.hex, i)}
                    className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-gray-700 transition-colors mt-1">
                    <span>{c.hex}</span>
                    {copied === i ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                  {c.usage && <p className="text-[11px] text-gray-400 mt-1 max-w-[80px]">{c.usage}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tipografia */}
        {(tipografia.fonts || []).some(f => f.name) && (
          <section>
            <SectionTitle>Tipografia</SectionTitle>
            <div className="space-y-4">
              {(tipografia.fonts || []).filter(f => f.name).map((f, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 leading-none mb-1" style={{ fontFamily: f.name }}>
                        {f.name}
                      </p>
                      {f.category && <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{f.category}</span>}
                    </div>
                    {f.weight && <p className="text-xs text-gray-400 text-right">Pesos: {f.weight}</p>}
                  </div>
                  {f.description && <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>}
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-gray-800 text-lg" style={{ fontFamily: f.name }}>
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                      abcdefghijklmnopqrstuvwxyz<br />
                      0123456789
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tom de voz */}
        {voz.voice && (
          <section>
            <SectionTitle>Tom de voz</SectionTitle>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{voz.voice}</p>
              {voz.examples && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Exemplos</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{voz.examples}</p>
                </div>
              )}
              {voz.avoid && (
                <div className="border border-red-100 rounded-xl p-3 bg-red-50/50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">Evitar</p>
                  <p className="text-sm text-red-600 leading-relaxed">{voz.avoid}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Elementos gráficos */}
        {elementos.description && (
          <section>
            <SectionTitle>Elementos gráficos</SectionTitle>
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-gray-600 leading-relaxed">{elementos.description}</p>
              {elementos.usage && <p className="text-sm text-gray-500 mt-3 leading-relaxed">{elementos.usage}</p>}
            </div>
          </section>
        )}

        {/* Dir. fotográfica */}
        {fotografia.style && (
          <section>
            <SectionTitle>Direção fotográfica</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Estilo</p>
                <p className="text-sm text-gray-600 leading-relaxed">{fotografia.style}</p>
              </div>
              {fotografia.dont && (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Evitar</p>
                  <p className="text-sm text-red-700 leading-relaxed">{fotografia.dont}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Aplicações */}
        {(aplicacoes.digital || aplicacoes.print) && (
          <section>
            <SectionTitle>Aplicações</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              {aplicacoes.digital && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Digital</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{aplicacoes.digital}</p>
                </div>
              )}
              {aplicacoes.print && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Físico</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{aplicacoes.print}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Downloads */}
        {(arquivos.files || []).length > 0 && (
          <section>
            <SectionTitle>Downloads</SectionTitle>
            <div className="space-y-2">
              {(arquivos.files || []).map((f, i) => (
                <a key={i} href={f.url} target="_blank" rel="noreferrer" download
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                    <Download size={16} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                    {f.size && <p className="text-xs text-gray-400">{(f.size / 1048576).toFixed(1)}MB</p>}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-700 transition-colors">Download →</span>
                </a>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 mt-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-400">{brandName} · Guia de identidade visual</p>
          <a href="https://brandportal.app" target="_blank" rel="noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
            Feito com BrandPortal <ExternalLink size={10} />
          </a>
        </div>
      </footer>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{children}</h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

function PillarCard({ title, text }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  )
}
