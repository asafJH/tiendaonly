// Ruta: frontend/src/pages/OrderDetail.jsx

import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function OrderDetail() {
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 1. Obtenemos el ID del pedido desde la URL
  const { id } = useParams()

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true)
        setError(null)

        // 2. Obtenemos los detalles principales del pedido
        //    RLS nos protege: solo podemos ver nuestros propios pedidos.
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single() // Esperamos un solo resultado

        if (orderError) throw orderError
        if (orderData) setOrder(orderData)

        // 3. Obtenemos los artículos de ESE pedido
        //    (Haciendo "join" con productos para ver los nombres y precios)
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            quantity,
            price_at_purchase,
            products (
              name
            )
          `)
          .eq('order_id', id)

        if (itemsError) throw itemsError
        if (itemsData) setOrderItems(itemsData)

      } catch (error) {
        console.error("Error al cargar el detalle del pedido:", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id]) // Se ejecuta si el ID de la URL cambia

  // Renderizado de estados
  if (loading) return <div>Cargando detalle del pedido...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error.message}</div>
  if (!order) return <div>Pedido no encontrado.</div>

  return (
    <div>
      <Link to="/profile">&larr; Volver a Mi Perfil</Link>
      
      <h2>Detalle del Pedido #{order.id}</h2>
      
      <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> {order.status}</p>
      <p><strong>Total Pagado:</strong> ${order.total_amount}</p>
      {/* (Aquí iría la dirección de envío) */}
      
      <hr style={{ margin: '20px 0' }} />

      <h3>Artículos Comprados</h3>
      
      {orderItems.length === 0 ? (
        <p>Este pedido no tiene artículos.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Producto</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Cantidad</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Precio (en la compra)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{item.products ? item.products.name : 'Producto no disponible'}</td>
                <td style={{ padding: '8px' }}>{item.quantity}</td>
                <td style={{ padding: '8px' }}>${item.price_at_purchase}</td>
                <td style={{ padding: '8px' }}>${(item.quantity * item.price_at_purchase).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}