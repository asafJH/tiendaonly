// Ruta: frontend/src/context/AuthContext.jsx (ACTUALIZADO)

import React, { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null) // <--- 1. AÑADIDO
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 2. Primero, obtenemos la sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      // 3. Si hay sesión, cargamos el perfil
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false)
      }
    })

    // Escuchamos cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        // 4. Si hay una nueva sesión (login), cargar perfil. Si no (logout), ponerlo en null.
        if (session) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // 5. Función para cargar el perfil (y el ROL)
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, phone')
        .eq('id', userId)
        .single()
        
      if (error) throw error
      if (data) setProfile(data)

    } catch (error) {
      console.error("Error al cargar el perfil:", error.message)
    } finally {
      setLoading(false)
    }
  }

  // 6. Pasamos el perfil y la sesión al contexto
  const value = { session, profile, loading }

  // No mostramos nada hasta que sepamos si el usuario está logueado
  // y tengamos su perfil (o sepamos que no hay sesión)
  if (loading) {
    return <div>Cargando...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook simple para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext)
}