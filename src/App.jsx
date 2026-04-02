import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import PublicPortal from './pages/PublicPortal'

function PrivateRoute({ children, user, loading }) {
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="text-sm text-neutral-400">Carregando...</span></div>
  return user ? children : <Navigate to="/login" replace />
}
function AuthRoute({ children, user, loading }) {
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}
export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])
  return (
    <Routes>
      <Route path="/login" element={<AuthRoute user={user} loading={loading}><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute user={user} loading={loading}><Register /></AuthRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<PrivateRoute user={user} loading={loading}><Dashboard user={user} /></PrivateRoute>} />
      <Route path="/editor/:id" element={<PrivateRoute user={user} loading={loading}><Editor user={user} /></PrivateRoute>} />
      <Route path="/p/:slug" element={<PublicPortal />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}