// Ruta: frontend/src/pages/AdminDashboard.jsx (VERSIÓN FINAL)

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { Link } from 'react-router-dom' 

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false) // Para deshabilitar botones

  // --- Función para obtener productos (la misma de antes) ---
  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // RLS permite al admin ver TODO
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setProducts(data)

    } catch (error) {
      console.error("Error al cargar productos:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])
  
  // --- NUEVA FUNCIÓN: Activar / Desactivar Producto ---
  const handleToggleActive = async (productId, currentStatus) => {
    setActionLoading(true);
    
    try {
      const newStatus = !currentStatus; // Invierte el estado actual
      
      const { error } = await supabase
        .from('products')
        .update({ is_active: newStatus })
        .eq('id', productId); // Actualiza solo este producto

      if (error) throw error;

      // Actualiza el estado local para reflejar el cambio inmediatamente
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? { ...p, is_active: newStatus } : p
        )
      );

      alert(`El producto ha sido ${newStatus ? 'ACTIVADO' : 'DESACTIVADO'} con éxito.`);

    } catch (error) {
      console.error("Error al cambiar estado:", error.message)
      setError(`Error al cambiar estado: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };


  return (
    <div>
      <h2>Panel de Administración</h2>
      <p>Aquí puedes gestionar todos los productos de la tienda.</p>
      
      <Link to="/admin/product/new" style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          + Crear Nuevo Producto
      </Link>
      
      <hr />

      <h3>Gestión de Productos</h3>
      {loading && <div>Cargando productos...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Precio</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Stock</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Estado</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ 
              borderBottom: '1px solid #eee', 
              backgroundColor: product.is_active ? 'white' : '#ffebeb' // Fondo rojo suave si está inactivo
            }}>
              <td style={{ padding: '8px' }}>{product.name}</td>
              <td style={{ padding: '8px' }}>${product.price}</td>
              <td style={{ padding: '8px' }}>{product.stock}</td>
              <td style={{ padding: '8px' }}>
                {product.is_active ? '✅ Activo' : '❌ Inactivo'}
              </td>
              <td style={{ padding: '8px' }}>
                <Link 
                  to={`/admin/product/${product.id}`}
                  style={{ marginRight: '10px', padding: '6px 12px', border: '1px solid #ccc', textDecoration: 'none', borderRadius: '4px', backgroundColor: '#f0f0f0', color: 'black' }}
                >
                  Editar
                </Link>
                
                {/* BOTÓN DE ACTIVAR/DESACTIVAR */}
                <button 
                  onClick={() => handleToggleActive(product.id, product.is_active)}
                  disabled={actionLoading}
                  style={{ 
                    padding: '6px 12px', 
                    backgroundColor: product.is_active ? '#f44336' : '#4CAF50', // Rojo para desactivar, Verde para activar
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {actionLoading ? '...' : product.is_active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}