import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  LayoutDashboard, FolderOpen, Library, Users,
  Layers, CreditCard, Settings, LogOut, ChevronRight, Zap
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: FolderOpen, label: 'Projetos', to: '/dashboard?tab=projects' },
  { icon: Library, label: 'Biblioteca', to: '/dashboard?tab=library' },
  { icon: Users, label: 'Equipe', to: '/dashboard?tab=team', badge: 'Em breve' },
  { icon: Layers, label: 'Templates', to: '/dashboard?tab=templates' },
]

const BOTTOM = [
  { icon: CreditCard, label: 'Plano e cobrança', to: '/billing' },
  { icon: Settings, label: 'Configurações', to: '/settings' },
]

export default function Sidebar({ profile }) {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname + location.search

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function isActive(to) {
    if (to === '/dashboard') return location.pathname === '/dashboard' && !location.search
    return path.startsWith(to) || path === to
  }

  return (
    <aside className="w-56 bg-surface-1 border-r border-surface-3 flex flex-col flex-shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-bold text-xs">B</span>
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-ink-1 text-sm truncate">
              {profile?.workspace_name || 'BrandPortal'}
            </p>
            <p className="text-[10px] text-ink-5 truncate">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ icon: Icon, label, to, badge }) => (
          <Link key={to} to={to}
            className={isActive(to) ? 'sidebar-item-active' : 'sidebar-item'}>
            <Icon size={16} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && <span className="text-[9px] bg-surface-4 text-ink-4 px-1.5 py-0.5 rounded font-medium">{badge}</span>}
          </Link>
        ))}
      </nav>

      {/* Plan badge */}
      <div className="px-3 pb-3">
        <div className="bg-surface-2 border border-surface-4 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-amber-400" />
            <span className="text-xs font-medium text-ink-2">Plano Free</span>
          </div>
          <div className="w-full bg-surface-4 rounded-full h-1 mb-2">
            <div className="bg-amber-400 h-1 rounded-full" style={{ width: '33%' }} />
          </div>
          <p className="text-[10px] text-ink-5">1/3 projetos usados</p>
          <Link to="/billing" className="flex items-center gap-1 text-[10px] text-accent hover:text-indigo-400 mt-2 transition-colors">
            Fazer upgrade <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="px-3 pb-2 border-t border-surface-3 pt-2 space-y-0.5">
        {BOTTOM.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} className={isActive(to) ? 'sidebar-item-active' : 'sidebar-item'}>
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}
        <button onClick={handleLogout} className="sidebar-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/5">
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
