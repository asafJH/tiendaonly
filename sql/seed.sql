-- Semilla de ejemplo: categorías, productos y perfiles (no crea usuarios auth)
INSERT INTO categories (id, name, description) VALUES
  (uuid_generate_v4(), 'Ropa', 'Prendas de vestir'),
  (uuid_generate_v4(), 'Electrónica', 'Dispositivos y accesorios');

INSERT INTO products (id, category_id, name, description, price, stock, is_active)
SELECT uuid_generate_v4(), c.id, 'Producto ejemplo - ' || c.name, 'Descripción de ejemplo', 99.90, 10, true
FROM categories c;
