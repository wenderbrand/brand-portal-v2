import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowRight, ArrowLeft, Briefcase, Building2, Palette, Package, Target, Share2, LayoutDashboard } from 'lucide-react'

const PROFILES = [
  { id: 'freelancer', icon: Briefcase, label: 'Freelancer', desc: 'Trabalho solo com clientes' },
  { id: 'studio', icon: Building2, label: 'Estúdio', desc: 'Agência ou escritório criativo' },
  { id: 'brand', icon: Palette, label: 'Marca', desc: 'Equipe interna de branding' },
]

const GOALS = [
  { id: 'deliver', icon: Package, label: 'Entregar', desc: 'Entregar guias de marca aos clientes' },
  { id: 'organize', icon: LayoutDashboard, label: 'Organizar', desc: 'Centralizar ativos e identidades' },
  { id: 'share', icon: Share2, label: 'Compartilhar', desc: 'Criar portais públicos de marca' },
]

export default function Onboarding({ user, onDone }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState('')
  const [goal, setGoal] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [loading, setLoading] = useState(false)

  const steps = ['Boas-vindas', 'Perfil', 'Objetivo', 'Workspace']
  const progress = ((step + 1) / steps.length) * 100

  function handleSubdomain(val) {
    setSubdomain(val.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+/, ''))
  }

  async function handleFinish() {
    if (!workspaceName.trim()) return
    setLoading(true)
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        profile_type: profile,
        goal,
        workspace_name: workspaceName,
        subdomain: subdomain || workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        onboarding_done: true,
      })
      onDone()
      navigate('/dashboard')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-surface-3 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">B</span>
          </div>
          <span className="font-display font-bold text-ink-1">BrandPortal</span>
        </div>
        <div className="flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                i < step ? 'bg-emerald-500/20 text-emerald-400' :
                i === step ? 'bg-accent text-white' :
                'bg-surface-3 text-ink-4'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-emerald-500/40' : 'bg-surface-4'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-surface-3">
        <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg animate-slide-up">

          {/* Step 0 - Welcome */}
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                <span className="text-4xl">👋</span>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-ink-1 mb-3">Bem-vindo ao BrandPortal</h1>
                <p className="text-ink-4 text-base leading-relaxed">
                  Vamos configurar seu workspace em menos de 2 minutos. Precisamos de algumas informações para personalizar sua experiência.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-8">
                {[['🎨', 'Editor profissional'], ['📁', 'Biblioteca de ativos'], ['🔗', 'Portal público']].map(([e, l]) => (
                  <div key={l} className="card p-4 text-center">
                    <div className="text-2xl mb-2">{e}</div>
                    <p className="text-xs text-ink-4">{l}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="btn-primary px-8 h-12 text-base mx-auto">
                Começar configuração <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 1 - Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-ink-1 mb-2">Qual é o seu perfil?</h1>
                <p className="text-sm text-ink-4">Isso nos ajuda a personalizar sua experiência</p>
              </div>
              <div className="space-y-3">
                {PROFILES.map(({ id, icon: Icon, label, desc }) => (
                  <button key={id} onClick={() => setProfile(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      profile === id ? 'border-accent bg-accent/5' : 'border-surface-4 bg-surface-2 hover:border-surface-5'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${profile === id ? 'bg-accent/20' : 'bg-surface-3'}`}>
                      <Icon size={20} className={profile === id ? 'text-accent' : 'text-ink-4'} />
                    </div>
                    <div>
                      <p className={`font-medium ${profile === id ? 'text-ink-1' : 'text-ink-2'}`}>{label}</p>
                      <p className="text-sm text-ink-4">{desc}</p>
                    </div>
                    {profile === id && <div className="ml-auto w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><span className="text-white text-xs">✓</span></div>}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary h-11 px-4"><ArrowLeft size={16} /></button>
                <button onClick={() => setStep(2)} disabled={!profile} className="btn-primary flex-1 h-11">
                  Continuar <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - Goal */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-ink-1 mb-2">Qual é o seu principal objetivo?</h1>
                <p className="text-sm text-ink-4">Você pode mudar isso depois nas configurações</p>
              </div>
              <div className="space-y-3">
                {GOALS.map(({ id, icon: Icon, label, desc }) => (
                  <button key={id} onClick={() => setGoal(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      goal === id ? 'border-accent bg-accent/5' : 'border-surface-4 bg-surface-2 hover:border-surface-5'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${goal === id ? 'bg-accent/20' : 'bg-surface-3'}`}>
                      <Icon size={20} className={goal === id ? 'text-accent' : 'text-ink-4'} />
                    </div>
                    <div>
                      <p className={`font-medium ${goal === id ? 'text-ink-1' : 'text-ink-2'}`}>{label}</p>
                      <p className="text-sm text-ink-4">{desc}</p>
                    </div>
                    {goal === id && <div className="ml-auto w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0"><span className="text-white text-xs">✓</span></div>}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary h-11 px-4"><ArrowLeft size={16} /></button>
                <button onClick={() => setStep(3)} disabled={!goal} className="btn-primary flex-1 h-11">
                  Continuar <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Workspace */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-ink-1 mb-2">Nomeie seu workspace</h1>
                <p className="text-sm text-ink-4">Este será o nome do seu ambiente no BrandPortal</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Nome do workspace *</label>
                  <input value={workspaceName} onChange={e => { setWorkspaceName(e.target.value); if (!subdomain) handleSubdomain(e.target.value) }}
                    className="input-field" placeholder="Ex: Studio Rubiale" autoFocus />
                </div>
                <div>
                  <label className="label">Subdomínio (opcional)</label>
                  <div className="flex items-center gap-0">
                    <input value={subdomain} onChange={e => handleSubdomain(e.target.value)}
                      className="input-field rounded-r-none border-r-0" placeholder="meuestudio"
                      style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
                    <div className="flex items-center px-4 h-[46px] bg-surface-3 border border-surface-5 rounded-r-xl text-xs text-ink-4 whitespace-nowrap">
                      .brandportal.app
                    </div>
                  </div>
                  <p className="text-xs text-ink-5 mt-1.5">URL pública dos seus portais. Pode ser alterado depois.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary h-11 px-4"><ArrowLeft size={16} /></button>
                <button onClick={handleFinish} disabled={!workspaceName.trim() || loading} className="btn-primary flex-1 h-11">
                  {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Entrar no workspace <ArrowRight size={16} /></>}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
