// Ruta: frontend/src/components/ProtectedRoute.jsx

import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    // Muestra un estado de carga mientras se verifica la sesión
    return <div>Cargando...</div>
  }

  // Si hay una sesión activa, permite el acceso a las rutas hijas
  if (session) {
    return <Outlet /> 
  }

  // Si no hay sesión, redirige al usuario a la página de login
  return <Navigate to="/login" replace />
}