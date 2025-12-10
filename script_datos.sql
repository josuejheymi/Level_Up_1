-- =========================================================
-- 3. INSERCIÓN DE DATOS (SEED DATA)
-- =========================================================

-- A. CATEGORÍAS
INSERT INTO categoria (nombre, imagen_url) VALUES 
('Consolas', 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500'),
('Juegos', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500'),
('Periféricos', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'),
('Sillas', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500');

-- B. USUARIO ADMINISTRADOR (Solo 1, como pediste)
-- Password 'admin123' (Como usamos NoOpPasswordEncoder en el código, va en texto plano)
INSERT INTO usuario (nombre, email, password, fecha_nacimiento, es_estudiante_duoc, codigo_referido_propio, puntos_level_up, nivel, rol) 
VALUES 
('Super Admin', 'admin@levelup.cl', 'admin123', '1990-01-01', 0, 'ADMIN001', 9999, 'Leyenda', 'ADMIN');

-- C. PRODUCTOS (10 Items variados)

-- 1. PS5 (Consola)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Sony PlayStation 5 Slim', 'Consola de última generación con 1TB de almacenamiento SSD y lector de discos.', 499990, 20, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', 'https://www.youtube.com/embed/tI5hm_ZhPr8', 1);

-- 2. Xbox Series X (Consola)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Xbox Series X 1TB', 'La Xbox más rápida y potente de la historia. Juega a miles de títulos.', 529990, 15, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500', 'https://www.youtube.com/embed/0tUqIHxH72c', 1);

-- 3. Nintendo Switch OLED (Consola)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Nintendo Switch OLED', 'Pantalla OLED de 7 pulgadas, colores intensos y audio mejorado.', 349990, 30, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500', 'https://www.youtube.com/embed/4mHq6Y7JSmg', 1);

-- 4. Elden Ring (Juego)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Elden Ring (PS5)', 'Juego del año. Un vasto mundo de fantasía oscura creado por Hidetaka Miyazaki.', 49990, 50, 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500', 'https://www.youtube.com/embed/E3Huy2cdih0', 2);

-- 5. God of War Ragnarok (Juego)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('God of War Ragnarök', 'Acompaña a Kratos y Atreus en un viaje mítico en busca de respuestas.', 54990, 45, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500', 'https://www.youtube.com/embed/EE-4GvjKcfs', 2);

-- 6. FIFA 24 / FC 24 (Juego)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('EA Sports FC 24', 'El juego de todos. Siente el realismo con HyperMotionV.', 39990, 100, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500', 'https://www.youtube.com/embed/XhP3Xh4LMA8', 2);

-- 7. Mouse Gamer (Periférico)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Mouse Logitech G Pro X', 'Ultraligero, sensor HERO 25K, diseñado para eSports.', 99990, 25, 'https://images.unsplash.com/photo-1615663245857-acda57da54d9?w=500', NULL, 3);

-- 8. Teclado Mecánico (Periférico)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Teclado Mecánico RGB 60%', 'Switches Blue, retroiluminación RGB completa y diseño compacto.', 45990, 40, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', NULL, 3);

-- 9. Audífonos Gamer (Periférico)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Headset HyperX Cloud II', 'Sonido envolvente 7.1 virtual, espuma viscoelástica y micrófono con cancelación de ruido.', 79990, 20, 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=500', NULL, 3);

-- 10. Silla Gamer (Silla)
INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url, video_url, categoria_id) VALUES 
('Silla Gamer Ergonómica Pro', 'Reclinable 180°, soporte lumbar y cervical, pistón clase 4.', 149990, 10, 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500', NULL, 4);
