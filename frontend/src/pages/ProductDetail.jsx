// Ruta: frontend/src/pages/ProductDetail.jsx (Actualizado)

import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx' // 1. Importar el hook de Auth

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addLoading, setAddLoading] = useState(false) // Estado para el botón
  
  const { id } = useParams()
  const { session } = useAuth() // 2. Obtener la sesión del usuario
  const navigate = useNavigate() // 3. Para redirigir al login

  useEffect(() => {
    async function fetchProduct() {
      // (Esta función es la misma que ya tenías)
      try {
        setLoading(true)
        setError(null)
        let { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error
        if (data) setProduct(data)
      } catch (error) {
        console.error("Error al cargar el producto:", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // 4. NUEVA FUNCIÓN para manejar el clic
  const handleAddToCart = async () => {
    // Primero, comprobar si el usuario está logueado
    if (!session) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      navigate('/login'); // Redirigir al login
      return;
    }

    try {
      setAddLoading(true);
      setError(null);

      // 5. Llamar a la función 'add_to_cart' que creamos en Supabase
      const { error } = await supabase.rpc('add_to_cart', {
        product_id_input: product.id,
        add_quantity: 1
      });

      if (error) throw error;

      alert(`¡"${product.name}" se ha añadido a tu carrito!`);

    } catch (error) {
      console.error("Error al añadir al carrito:", error.message)
      setError(error.message)
      alert(`Error: ${error.message}`);
    } finally {
      setAddLoading(false);
    }
  }

  // --- Renderizado (igual que antes, solo cambia el <button>) ---
  
  if (loading) return <div>Cargando producto...</div>
  if (error && !addLoading) return <div style={{ color: 'red' }}>Error: {error}</div>
  if (!product) return <div>Producto no encontrado.</div>

  return (
    <div>
      <Link to="/">&larr; Volver al catálogo</Link>
      
      <h1>{product.name}</h1>
      
      {product.images && product.images.length > 0 && (
        <img 
          src={product.images[0]} 
          alt={product.name} 
          style={{ maxWidth: '400px', border: '1px solid #ddd' }}
        />
      )}
      
      <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>${product.price}</p>
      <p>{product.stock} disponibles</p>
      
      <hr />
      
      <h3>Descripción</h3>
      <p>{product.description || 'Este producto no tiene descripción.'}</p>
      
      <br />
      
      {/* 6. Conectar el botón a la nueva función */}
      <button onClick={handleAddToCart} disabled={addLoading}>
        {addLoading ? 'Añadiendo...' : 'Añadir al Carrito'}
      </button>

      {/* Muestra errores específicos del "añadir al carrito" */}
      {error && addLoading && (
         <p style={{ color: 'red' }}>Error al añadir: {error}</p>
      )}
    </div>
  )
}