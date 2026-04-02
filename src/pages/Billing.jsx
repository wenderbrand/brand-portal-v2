import React, { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    desc: 'Para testar e projetos pessoais',
    icon: Zap,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    features: ['3 projetos de marca', '500MB storage', 'Portal público', 'Templates básicos', 'Suporte por e-mail'],
    cta: 'Plano atual',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 97,
    desc: 'Para freelancers e designers',
    icon: Crown,
    color: 'text-accent',
    bg: 'bg-accent/10',
    features: ['Projetos ilimitados', '10GB storage', 'Domínio personalizado', 'Todos os templates', 'White-label', 'Versionamento', 'Suporte prioritário'],
    cta: 'Assinar Pro',
    highlight: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: 247,
    desc: 'Para agências e estúdios',
    icon: Building2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    features: ['Tudo do Pro', '5 membros de equipe', '50GB storage', 'Analytics avançado', 'API access', 'Onboarding dedicado', 'SLA garantido'],
    cta: 'Assinar Team',
  },
]

export default function Billing({ user, profile }) {
  const [billing, setBilling] = useState('monthly')
  const currentPlan = 'free'

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar profile={profile} />
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="section-title">Plano e cobrança</h1>
            <p className="text-sm text-ink-4 mt-1">Escolha o plano ideal para o seu negócio</p>
          </div>

          {/* Current plan */}
          <div className="card p-5 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Zap size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink-1">Plano atual: <span className="text-accent">Free</span></p>
              <p className="text-xs text-ink-4 mt-0.5">1 de 3 projetos usados · 12MB de 500MB</p>
            </div>
            <div className="w-32 bg-surface-4 rounded-full h-1.5">
              <div className="bg-accent h-1.5 rounded-full" style={{ width: '33%' }} />
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-sm ${billing === 'monthly' ? 'text-ink-1' : 'text-ink-4'}`}>Mensal</span>
            <button onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-12 h-6 rounded-full transition-colors ${billing === 'annual' ? 'bg-accent' : 'bg-surface-4'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${billing === 'annual' ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${billing === 'annual' ? 'text-ink-1' : 'text-ink-4'}`}>
              Anual <span className="text-emerald-400 text-xs ml-1">-20%</span>
            </span>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {PLANS.map(plan => {
              const Icon = plan.icon
              const price = billing === 'annual' ? Math.round(plan.price * 0.8) : plan.price
              const isCurrent = currentPlan === plan.id

              return (
                <div key={plan.id} className={`relative card p-6 flex flex-col ${plan.highlight ? 'border-accent/40 bg-accent/5' : ''}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="badge-purple text-[10px] px-3 py-1 rounded-full font-semibold">Mais popular</span>
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${plan.bg} flex items-center justify-center mb-4`}>
                    <Icon size={18} className={plan.color} />
                  </div>
                  <h3 className="font-display font-bold text-ink-1 text-lg">{plan.name}</h3>
                  <p className="text-xs text-ink-4 mb-4">{plan.desc}</p>
                  <div className="mb-5">
                    {price === 0 ? (
                      <p className="text-3xl font-display font-bold text-ink-1">Grátis</p>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-ink-4">R$</span>
                        <span className="text-3xl font-display font-bold text-ink-1">{price}</span>
                        <span className="text-sm text-ink-4">/mês</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1 mb-6">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <Check size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-ink-3">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button disabled={isCurrent || plan.disabled}
                    className={`w-full h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent ? 'bg-surface-3 text-ink-4 cursor-default' :
                      plan.highlight ? 'bg-accent text-white hover:bg-indigo-500 active:scale-95' :
                      'bg-surface-3 text-ink-2 border border-surface-5 hover:bg-surface-4'
                    }`}>
                    {isCurrent ? 'Plano atual' : <>{plan.cta} <ArrowRight size={14} /></>}
                  </button>
                  {!isCurrent && !plan.disabled && (
                    <p className="text-[10px] text-ink-5 text-center mt-2">Integração com Mercado Pago em breve</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* FAQ */}
          <div className="card p-6">
            <h3 className="font-display font-semibold text-ink-1 mb-4">Perguntas frequentes</h3>
            <div className="space-y-4">
              {[
                ['Posso cancelar a qualquer momento?', 'Sim. Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas de cancelamento.'],
                ['Como funciona o período de teste?', 'O plano Free é gratuito para sempre. Planos pagos terão 14 dias de teste gratuito em breve.'],
                ['Quais formas de pagamento são aceitas?', 'Cartão de crédito, débito e Pix via Mercado Pago (em breve).'],
              ].map(([q, a]) => (
                <div key={q} className="border-b border-surface-4 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-ink-2 mb-1">{q}</p>
                  <p className="text-sm text-ink-4">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
