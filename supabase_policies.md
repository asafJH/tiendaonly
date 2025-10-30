# Políticas RLS - Ejemplos y explicación

A continuación se muestran políticas sugeridas para las tablas principales. **Adapte** según su JWT y campos.

## Consideraciones generales
- Distinga roles en el JWT: `auth.jwt() ->> 'role'` (p. ej. 'admin' / 'user').
- `auth.uid()` devuelve el uuid del usuario autenticado.
- Use `WITH CHECK` para inserts/updates que condicionen los valores entrantes.

## Perfiles (profiles)
-- Solo el usuario puede ver/editar su perfil
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admin puede seleccionar todo
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

## Carritos y cart_items
-- Solo el propietario puede leer/escribir en su carrito
CREATE POLICY "carts_owner" ON carts
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "cart_items_owner" ON cart_items
  FOR ALL USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));

## Orders
CREATE POLICY "orders_owner" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "orders_insert_auth" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin full access example
CREATE POLICY "orders_admin" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

## Products / Categories (público)
-- Lectura pública solo de productos activos
CREATE POLICY "products_public_select" ON products
  FOR SELECT USING (is_active = true);

-- Admin: full CRUD
CREATE POLICY "products_admin" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

## Recomendaciones
- Pruebe políticas con cuentas de prueba: un usuario común y un admin.
- Use la `service_role` key sólo en servidores seguros (no en frontend).
- Verifique `EXPLAIN` y logs cuando una consulta sea denegada.

