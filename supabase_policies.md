# 🛡️ Políticas de Seguridad RLS y Funciones de Base de Datos

Este archivo documenta las reglas de seguridad a nivel de fila (RLS) y las funciones PostgreSQL que definen la lógica de negocio del lado del servidor.

## 1. Funciones de Base de Datos (Lógica de Negocio)

Estas funciones se ejecutan en la base de datos para manejar el carrito y los pedidos de forma segura.

### Función: `create_user_cart()`
Crea un carrito vacío automáticamente cuando un nuevo usuario se registra (se dispara con el `TRIGGER`).

```sql
CREATE OR REPLACE FUNCTION public.create_user_cart()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.cart (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que llama a la función
CREATE TRIGGER on_new_user_create_cart
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_cart(); 