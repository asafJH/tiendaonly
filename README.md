# 🛒 Tienda en Línea - Proyecto 2o Departamental (tiendaonly)

Este proyecto es una tienda en línea (e-commerce) completa construida como parte del 2o Departamental. Utiliza React (con Vite) para el frontend y Supabase para todo el backend (Autenticación, Base de Datos Postgres, Almacenamiento de Imágenes y Seguridad RLS).

**Enlace de la aplicación publicada (Deploy):**
[https://tiendaonly.vercel.app/](https://tiendaonly.vercel.app/)

**Enlace del Repositorio:**
[https://github.com/asafJH/tiendaonly](https://github.com/asafJH/tiendaonly)

---

## 🛠️ Arquitectura y Tecnologías

* **Frontend:** React (Vite), CSS Puro (Clases personalizadas en `index.css`).
* **Backend (BaaS):** Supabase
* **Base de Datos:** Supabase Postgres
* **Autenticación:** Supabase Auth (Email/Contraseña, Roles en `profiles`).
* **Almacenamiento:** Supabase Storage (para las imágenes de los productos).
* **Seguridad:** Supabase RLS (Seguridad a Nivel de Fila).
* **Hosting:** Vercel (conectado a GitHub).

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/asafJH/tiendaonly.git](https://github.com/asafJH/tiendaonly.git)
    cd tiendaonly
    ```

2.  **Instalar Dependencias del Frontend:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Configurar Variables de Entorno (Supabase):**
    * Crea un archivo `.env` dentro de la carpeta `frontend/`.
    * Copia y pega el contenido de `.env.example` y rellena tus claves de Supabase.

    ```dotenv
    # frontend/.env
    VITE_SUPABASE_URL="https://[TU_PROYECTO_URL].supabase.co"
    VITE_SUPABASE_ANON_KEY="[TU_CLAVE_ANON_PUBLICA]"
    ```

4.  **Configurar la Base de Datos (Supabase):**
    * Ve a tu proyecto de Supabase y ejecuta los scripts SQL en el Editor SQL en este orden:
    * 1. Ejecuta el contenido de `sql/init.sql` (para crear tablas y funciones).
    * 2. Ejecuta el contenido de `sql/seed.sql` (para añadir productos de prueba).
    * 3. Ejecuta el contenido de `supabase_policies.md` (para activar la seguridad RLS).

5.  **Iniciar la Aplicación:**
    ```bash
    npm run dev
    ```
    (La aplicación estará disponible en `http://localhost:5173`)

---

## 🔑 Credenciales de Prueba

Para probar el flujo de la aplicación, puedes usar las siguientes credenciales (o crear las tuyas):

* **Usuario Cliente:**
    * **Email:** `jeremias@gmail.com`
    * **Rol:** `user`
    * *Permisos: Puede ver el catálogo, añadir al carrito, pagar y ver su historial de pedidos.*

* **Usuario Administrador:**
    * **Email:** `asafhg987@gmail.com`
    * **Rol:** `admin` (Asignado manualmente en la tabla `profiles` de Supabase).
    * *Permisos: Todos los del cliente, más acceso al Panel de Administración (`/admin`) para crear, editar, activar/desactivar y subir imágenes de productos.*