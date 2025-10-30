// Ruta: frontend/src/components/AdminRoute.jsx

import React from 'react'
import { useAuth } from '../context/AuthContext.jsx' // Importa el hook para acceder a la sesión y el perfil
import { Navigate, Outlet } from 'react-router-dom' // Outlet es para renderizar rutas anidadas

export default function AdminRoute() {
  const { session, profile, loading } = useAuth() // Obtiene la sesión y el perfil

  // 1. Mostrar estado de carga mientras se verifica
  if (loading) {
    return <div>Verificando permisos de administrador...</div>
  }

  // 2. Verificar Permisos
  //    Debe haber una sesión Y el rol debe ser 'admin'
  if (session && profile?.role === 'admin') {
    // Si es administrador, renderiza las rutas anidadas (AdminDashboard, ProductForm, etc.)
    return <Outlet /> 
  }

  // 3. Redirigir si no es administrador o no está logueado
  //    Lo enviamos de vuelta al inicio de la tienda
  return <Navigate to="/" replace />
}