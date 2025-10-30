// Ruta: frontend/src/pages/Login.jsx

import React, { useState } from 'react'
// Imports con extensión .js y .jsx (¡esto es correcto!)
import { supabase } from '../lib/supabaseClient.js' 
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx' 

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const { session } = useAuth() 

  const handleLogin = async (e) => {
    e.preventDefault() 
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error
      navigate('/profile')

    } catch (error) {
      console.error('Error en el inicio de sesión:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (session) {
    navigate('/profile')
    return null; 
  }

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <p>Usa las credenciales que creaste en Supabase (ej. user@example.com)</p>
      
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Correcto
            placeholder="tu@email.com"
            required
            style={{ color: 'black' }} 
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            // ¡¡¡AQUÍ ESTABA EL ERROR!!! (Corregido a e.target.value)
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Tu contraseña"
            required
            style={{ color: 'black' }} 
          />
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}
    </div>
  )
}