// Ruta: frontend/src/pages/ProductForm.jsx (COMPLETO Y CORREGIDO)

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0.00,
    stock: 0,
    category_id: '',
    is_active: true,
    images: [], 
    file: null, 
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = id !== undefined && id !== 'new';
  const pageTitle = isEditing ? `Editar Producto #${id}` : 'Crear Nuevo Producto';

  // --- IMPLEMENTACIÓN COMPLETA DE useEffect ---
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      // 1. Cargar todas las categorías (RLS debe permitir lectura pública)
      let { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');
      
      if (catError) {
        setError("Error al cargar categorías: " + catError.message);
        setLoading(false);
        return;
      }
      setCategories(catData);

      let initialCategoryId = catData.length > 0 ? catData[0].id : '';

      // 2. Si es modo edición, cargar datos del producto
      if (isEditing) {
        let { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (productError) {
          setError("Error al cargar datos del producto: " + productError.message);
          setLoading(false);
          return;
        }
        
        if (productData) {
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: parseFloat(productData.price) || 0.00,
            stock: parseInt(productData.stock) || 0,
            category_id: productData.category_id || initialCategoryId, // Usa la categoría del producto si existe
            is_active: productData.is_active || false,
            images: productData.images || [],
            file: null
          });
        }
      } else {
        // 3. Modo Creación: Inicializar la categoría
        setFormData(prev => ({ ...prev, category_id: initialCategoryId }));
      }

      setLoading(false);
    }
    loadData();
  }, [id, isEditing]);
  // -----------------------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files.length > 0) {
        setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    (name === 'price' ? parseFloat(value) : 
                    (name === 'stock' || name === 'category_id' ? parseInt(value) : value))
        }));
    }
  };

  // --- NUEVA FUNCIÓN: Subir la imagen a Supabase Storage ---
  const uploadImage = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`; 
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };
  // -----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      let imageUrls = formData.images;
      
      // 1. Si hay un archivo nuevo, subirlo y obtener la URL
      if (formData.file) {
        const newUrl = await uploadImage(formData.file);
        imageUrls = imageUrls ? [...imageUrls, newUrl] : [newUrl];
      }

      // 2. Datos a enviar
      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        category_id: formData.category_id,
        is_active: formData.is_active,
        images: imageUrls, 
      };

      // 3. UPDATE o INSERT
      let result;
      if (isEditing) {
        result = await supabase.from('products').update(dataToSubmit).eq('id', id).select();
      } else {
        result = await supabase.from('products').insert(dataToSubmit).select();
      }

      if (result.error) throw result.error;

      alert(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito!`);
      navigate('/admin');

    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  
  // --- INICIO DEL RENDERIZADO ---

  if (loading) return <div>Cargando formulario...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <Link to="/admin">&larr; Volver al Panel de Administración</Link>
      <h1>{pageTitle}</h1>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', padding: '20px', border: '1px solid #ccc' }}>
        
        {/* Nombre */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description">Descripción:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', minHeight: '100px' }} />
        </div>

        {/* Precio y Stock (en la misma línea) */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="price">Precio:</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="stock">Stock:</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required min="0" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Categoría */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="category_id">Categoría:</label>
          <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} required style={{ width: '100%' }}>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Estado (Activo/Inactivo) */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} style={{ marginRight: '10px' }} />
          <label htmlFor="is_active">Producto Activo (Visible al público)</label>
        </div>

        {/* ----------------- CAMPO DE IMAGEN ----------------- */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="file">Subir Imagen:</label>
          <input type="file" id="file" name="file" onChange={handleChange} accept="image/*" style={{ width: '100%' }} />
          
          {/* Visualización de la imagen actual (si estamos editando y existe) */}
          {isEditing && formData.images && formData.images.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ marginBottom: '5px', fontSize: '0.9em' }}>Imagen actual:</p>
              <img src={formData.images[0]} alt="Imagen actual" style={{ maxWidth: '100px', height: 'auto', border: '1px solid #ccc' }} />
            </div>
          )}
        </div>
        {/* -------------------------------------------------------- */}
        
        {/* Botón de Guardar */}
        <button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red', marginTop: '15px' }}>Error: {error}</p>}
    </div>
  );
}