// Ruta: frontend/src/pages/Home.jsx (VERSIÓN FINAL CON IMAGENES Y SINTAXIS CORREGIDA)

import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { Link } from 'react-router-dom'

// 1. Componente reutilizable ProductCard (CON SOPORTE PARA IMAGEN)
function ProductCard({ product }) {
  // 1.1 Determinar si el producto tiene una imagen válida
  // El campo 'images' en Supabase es un array (images TEXT[]), tomamos el primer elemento
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="product-card">
      
      {/* 👇 MODIFICACIÓN CLAVE: Muestra la imagen o el placeholder 👇 */}
      <div style={{ height: '160px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {imageUrl ? (
          // Muestra la imagen si la URL existe
         // CÓDIGO CORREGIDO (Usar 'contain' para mostrar la imagen completa)
<img 
    src={imageUrl} 
    alt={product.name} 
    // NUEVO ESTILO: AJUSTA la imagen completamente dentro del área gris
    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
/>
        ) : (
          // Muestra el placeholder de la letra si NO hay URL
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#9ca3af' }}>
            {product.name.charAt(0)}
          </span>
        )}
      </div>
      {/* 👆 FIN DE LA MODIFICACIÓN 👆 */}
      
      <h3 className="product-title">
        {product.name}
      </h3>
      
      <p className="product-price">
        ${product.price}
      </p>
      
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
        {product.stock} disponibles
      </p>
      
      <Link 
        to={`/product/${product.id}`}
        className="product-details-link"
      >
        Ver detalles
      </Link>
    </div>
  )
}


// 2. Componente principal de la página de Inicio
export default function Home() { // <--- ¡EXPORTACIÓN CORREGIDA!
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        let { data, error } = await supabase
          .from('products')
          .select('*') 
          .eq('is_active', true) 
          .order('created_at', { ascending: false })

        if (error) throw error;
        if (data) setProducts(data);

      } catch (error) {
        console.error("Error al cargar productos:", error.message)
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []) 

  // Renderizado de estados (Carga, Error, Éxito)
  if (loading) return <div style={{ padding: '32px', fontSize: '18px' }}>Cargando productos...</div> 
  if (error) return <div style={{ padding: '32px', color: 'red', fontSize: '18px' }}>Error al cargar productos: {error}</div>

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: '700', padding: '20px' }}>Catálogo de Productos</h2> 
      
      <div className="product-list-container"> 
        {products.length === 0 ? (
          <p style={{ padding: '20px', fontSize: '18px' }}>No hay productos disponibles.</p>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}