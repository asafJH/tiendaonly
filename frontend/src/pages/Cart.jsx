// Ruta: frontend/src/pages/Cart.jsx (MODIFICADO CON ESTILOS PROFESIONALES)

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom' 

// Componente CartItem (usando la clase item-row)
function CartItem({ item }) {
  const product = item.products;

  if (!product) return <div>Ítem no disponible</div>;

  return (
    // Aplica el estilo para filas limpias y separadas
    <div className="item-row"> 
      <div style={{ flex: 3 }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{product.name}</h4>
        <p style={{ color: '#10b981', fontWeight: 600 }}>Precio: ${product.price}</p>
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <p>Cant: {item.quantity}</p>
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <p style={{ fontWeight: 700 }}>Subtotal: ${(product.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}

// Componente principal de la página del Carrito
export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState(null)
  const { session } = useAuth()
  const navigate = useNavigate()

  // Función para obtener ítems del carrito (la misma de antes)
  useEffect(() => {
    async function fetchCartItems() {
      if (!session) return;
      try {
        setLoading(true)
        setError(null)
        const { data: cartData, error: cartError } = await supabase
          .from('cart')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        if (cartError) throw cartError;
        if (!cartData) throw new Error("No se encontró el carrito del usuario.");
        const userCartId = cartData.id;
        const { data: itemsData, error: itemsError } = await supabase
          .from('cart_items')
          .select(`*, products (name, price, images)`)
          .eq('cart_id', userCartId);
        if (itemsError) throw itemsError;
        if (itemsData) setCartItems(itemsData);
      } catch (error) {
        console.error("Error al cargar el carrito:", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCartItems();
  }, [session])

  // Función para manejar el Pago (la misma de antes)
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    try {
      setCheckoutLoading(true);
      setError(null);

      const { data: newOrderId, error } = await supabase.rpc('create_order_from_cart');

      if (error) throw error;

      alert("¡Pago exitoso! Tu pedido ha sido creado.");
      navigate('/profile'); 

    } catch (error) {
      console.error("Error durante el pago:", error.message)
      setError(error.message)
      alert(`Error: ${error.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  }

  // Cálculo del total (el mismo de antes)
  const total = cartItems.reduce((acc, item) => {
    const price = item.products ? item.products.price : 0;
    return acc + (price * item.quantity);
  }, 0);

  // Renderizado de estados
  if (loading) return <div style={{ padding: '2rem' }}>Cargando carrito...</div>
  if (error && !checkoutLoading) return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mi Carrito de Compras</h2>
      
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        // Aplicamos la clase CSS 'item-container'
        <div className="item-container"> 
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
          
          <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Total */}
            <div style={{ fontSize: '1.5em', fontWeight: 800, marginRight: '20px' }}>
              Total: ${total.toFixed(2)}
            </div>
            
            {/* Botón de Pago con estilo profesional */}
            <button 
              onClick={handleCheckout} 
              disabled={checkoutLoading}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#3b82f6', /* Azul primario */
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: checkoutLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {checkoutLoading ? 'Procesando pago...' : 'Proceder al Pago'}
            </button>
          </div>

          {error && checkoutLoading && (
            <p style={{ color: 'red', clear: 'both', paddingTop: '10px' }}>Error al pagar: {error}</p>
          )}
        </div>
      )}
    </div>
  )
}