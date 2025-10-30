# Proyecto 2° Departamental - Tienda en Línea (Starter)

**Fecha entrega:** 31 de octubre de 2025 07:00

Este repositorio contiene un scaffold inicial para el proyecto: supabase (backend) + frontend (React + Vite) y ejemplos de RLS/policies, migraciones SQL, y archivos básicos para arrancar rápido.

## Contenido
- `sql/` - migraciones y archivo seed (tablas, RLS, policies ejemplos).
- `supabase_policies.md` - explicaciones y ejemplos de políticas RLS.
- `frontend/` - scaffold mínimo de React + Vite + Tailwind (archivos esenciales).
- `erd.png` - diagrama ERD simple.
- `docs/video-instructions.md` - guía para grabar el video de demostración.

## Instrucciones rápidas
1. Crear proyecto en Supabase (Auth, Database, Storage). Activar RLS en tablas sensibles.
2. Ejecutar las migraciones en `sql/init.sql` (puede usar psql o la consola SQL de Supabase).
3. Ajustar variables de entorno en `frontend/.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
4. Instalar dependencias en frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Leer `supabase_policies.md` y adaptar los `auth.jwt() ->> 'role'` según su configuración JWT.

## Archivos de prueba
- Usuarios de ejemplo y productos están en `sql/seed.sql`. Los tokens de admin deben generarse desde Supabase o usando `service_role` para pruebas de políticas.

> Este es un scaffold inicial. Personalícelo para cumplir todos los criterios del enunciado (ver políticas RLS, validaciones, accesibilidad, paginación, tests).

