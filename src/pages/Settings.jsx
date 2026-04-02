import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/layout/Sidebar'
import { Save, User, Shield, Bell, Trash2 } from 'lucide-react'

export default function Settings({ user, profile, onUpdate }) {
  const [tab, setTab] = useState('workspace')
  const [workspaceName, setWorkspaceName] = useState(profile?.workspace_name || '')
  const [subdomain, setSubdomain] = useState(profile?.subdomain || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update({ workspace_name: workspaceName, subdomain }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    onUpdate()
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ]

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar profile={profile} />
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 max-w-3xl">
          <div className="mb-8">
            <h1 className="section-title">Configurações</h1>
            <p className="text-sm text-ink-4 mt-1">Gerencie seu workspace e preferências</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-2 border border-surface-4 rounded-xl p-1 w-fit mb-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === id ? 'bg-surface-4 text-ink-1' : 'text-ink-4 hover:text-ink-3'
                }`}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>

          {tab === 'workspace' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold text-ink-1 mb-5">Informações do workspace</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Nome do workspace</label>
                    <input value={workspaceName} onChange={e => setWorkspaceName(e.target.value)}
                      className="input-field" placeholder="Nome do seu workspace" />
                  </div>
                  <div>
                    <label className="label">Subdomínio</label>
                    <div className="flex items-center">
                      <input value={subdomain} onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="input-field rounded-r-none border-r-0" />
                      <div className="flex items-center px-4 h-[46px] bg-surface-3 border border-surface-5 rounded-r-xl text-xs text-ink-4 whitespace-nowrap">
                        .brandportal.app
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="label">E-mail</label>
                    <input value={user.email} disabled className="input-field opacity-50 cursor-not-allowed" />
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-surface-4">
                  <button onClick={handleSave} disabled={saving} className="btn-primary h-10">
                    {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> :
                      <><Save size={15} /> {saved ? 'Salvo!' : 'Salvar alterações'}</>}
                  </button>
                </div>
              </div>

              <div className="card p-6 border-red-500/20">
                <h3 className="font-semibold text-red-400 mb-2">Zona de perigo</h3>
                <p className="text-sm text-ink-4 mb-4">Ações irreversíveis. Tome cuidado.</p>
                <button className="btn-danger h-9 text-xs gap-2">
                  <Trash2 size={13} /> Excluir conta
                </button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="card p-6">
              <h3 className="font-semibold text-ink-1 mb-5">Segurança da conta</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Nova senha</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">Confirmar nova senha</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <button className="btn-primary h-10"><Save size={15} /> Atualizar senha</button>
              </div>

              <div className="mt-6 pt-6 border-t border-surface-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-2">Autenticação 2FA</p>
                    <p className="text-xs text-ink-4 mt-0.5">Adicione uma camada extra de segurança</p>
                  </div>
                  <button className="btn-secondary h-9 text-xs">Configurar</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card p-6">
              <h3 className="font-semibold text-ink-1 mb-5">Preferências de notificação</h3>
              <div className="space-y-4">
                {[
                  ['Acesso ao portal', 'Quando alguém acessar seu portal público'],
                  ['Downloads', 'Quando alguém baixar um arquivo do portal'],
                  ['Novidades do produto', 'Updates e novas funcionalidades'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-center justify-between py-3 border-b border-surface-4 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-ink-2">{title}</p>
                      <p className="text-xs text-ink-4">{desc}</p>
                    </div>
                    <button className="w-11 h-6 bg-accent rounded-full relative transition-colors">
                      <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
