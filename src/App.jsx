import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import PublicPortal from './pages/PublicPortal'
import Billing from './pages/Billing'
import Settings from './pages/Settings'

function Loader() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="text-ink-4 text-sm">Carregando...</span>
      </div>
    </div>
  )
}

function PrivateRoute({ children, user, loading, profile }) {
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user && profile && !profile.onboarding_done) return <Navigate to="/onboarding" replace />
  return children
}

function AuthRoute({ children, user, loading }) {
  if (loading) return <Loader />
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) await loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) await loadProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<AuthRoute user={user} loading={loading}><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute user={user} loading={loading}><Register /></AuthRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={
        loading ? <Loader /> : user ? <Onboarding user={user} onDone={() => loadProfile(user.id)} /> : <Navigate to="/login" replace />
      } />

      {/* App */}
      <Route path="/dashboard" element={<PrivateRoute user={user} loading={loading} profile={profile}><Dashboard user={user} profile={profile} /></PrivateRoute>} />
      <Route path="/editor/:id" element={<PrivateRoute user={user} loading={loading} profile={profile}><Editor user={user} /></PrivateRoute>} />
      <Route path="/billing" element={<PrivateRoute user={user} loading={loading} profile={profile}><Billing user={user} profile={profile} /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute user={user} loading={loading} profile={profile}><Settings user={user} profile={profile} onUpdate={() => loadProfile(user.id)} /></PrivateRoute>} />

      {/* Public */}
      <Route path="/p/:slug" element={<PublicPortal />} />

      {/* Default */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}
