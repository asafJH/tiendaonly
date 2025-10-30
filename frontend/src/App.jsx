// Ruta: frontend/src/App.jsx (VERSIÓN FINAL Y LIMPIA CON BARRA DE NAVEGACIÓN PROFESIONAL)

import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx' 
import ProtectedRoute from './components/ProtectedRoute.jsx' 
import AdminRoute from './components/AdminRoute.jsx'      

// --- Importa tus páginas ---
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Profile from './pages/Profile.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProductForm from './pages/ProductForm.jsx' // Agregada la importación faltante

// --- Componente Principal App ---
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 👇👇 MENÚ DE NAVEGACIÓN PROFESIONAL (Usando clases de index.css) 👇👇 */}
        <div className="navbar-container">
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="navbar-item">
              <Link to="/profile">Perfil</Link>
            </li>
            <li className="navbar-item">
              <Link to="/cart">Carrito</Link>
            </li>
            <li className="navbar-item">
              <Link to="/admin">Admin</Link>
            </li>
            <li className="navbar-item">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
        
        {/* Definición de Rutas */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas Protegidas (Cualquier usuario logueado) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order/:id" element={<OrderDetail />} />
          </Route>
          
          {/* Rutas de Administrador (Solo rol 'admin') */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/product/new" element={<ProductForm />} />
            <Route path="/admin/product/:id" element={<ProductForm />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App