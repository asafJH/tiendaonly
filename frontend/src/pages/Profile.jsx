// Ruta: frontend/src/pages/Profile.jsx (MODIFICADO CON ESTILOS PROFESIONALES)

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom' 

export default function Profile() {
  const { session } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrders() {
      if (!session) return;

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) throw error;
        if (data) setOrders(data);

      } catch (error) {
        console.error("Error al cargar los pedidos:", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [session])

  return (
    <div style={{ padding: '2rem' }}> {/* Añadimos padding al contenedor principal */}
      <h2>Mi Perfil</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
        Email: <strong>{session?.user?.email}</strong>
      </p>
      
      {/* Botón de Cerrar Sesión con estilo profesional */}
      <button 
        onClick={() => supabase.auth.signOut()}
        style={{
          padding: '8px 15px',
          backgroundColor: '#f44336', /* Rojo */
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Cerrar Sesión
      </button>

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      <h2>Mi Historial de Pedidos</h2>

      {loading && <div>Cargando pedidos...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {orders.length === 0 && !loading && (
        <p>No has realizado ningún pedido todavía.</p>
      )}

      {orders.length > 0 && (
        // Aplicamos la clase CSS profesional 'data-table'
        <table className="data-table"> 
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>${order.total_amount}</td>
                <td>
                  <span style={{ 
                    // Estilos de estado (usando CSS en línea para el color dinámico)
                    backgroundColor: order.status === 'paid' ? '#d1fae5' : '#fee2e2', 
                    color: order.status === 'paid' ? '#059669' : '#ef4444', 
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/order/${order.id}`} 
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}