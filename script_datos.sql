-- =======================================================
-- SCRIPT DE DATOS INICIALES - LEVEL UP GAMER 
-- Ejecutar este script en MySQL Workbench
-- =======================================================

USE levelup_db; -- O el nombre que le hayas puesto a tu BD

-- 1. USUARIOS (Admin y Clientes)
-- Nota: Las contraseñas están sin encriptar como configuramos en SecurityConfig (NoOp)
INSERT INTO usuarios (nombre, email, password, rol, es_estudiante_duoc) VALUES 
('Admin Supremo', 'admin@levelup.cl', 'admin123', 'ADMIN', 0),
('Vendedor Pro', 'ventas@levelup.cl', 'ventas123', 'VENDEDOR', 0),
('Cliente Gamer', 'cliente@duoc.cl', '123456', 'CLIENTE', 1);

-- 2. CATEGORÍAS
INSERT INTO categorias (nombre, imagen_url) VALUES 
('Consolas', 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=500'),
('PC Gamer', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=500'),
('Periféricos', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500'),
('Sillas', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=500');

-- 3. PRODUCTOS (Asumiendo los IDs de categorías de arriba son 1, 2, 3, 4)
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id) VALUES 
-- Consolas
('PlayStation 5 Slim', 'La consola más potente de Sony con lector de disco.', 549990, 15, 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-disc-console-image-block-01-en-16nov23?$1600px$', 1),
('Nintendo Switch OLED', 'Pantalla vibrante de 7 pulgadas para jugar donde quieras.', 349990, 20, 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/en_US/switch/site-design-update/hardware/switch/oled-player-modes/tabletop-mode', 1),

-- PC Gamer
('PC Master Race i9', 'Intel Core i9, RTX 4090, 64GB RAM. Una bestia.', 2500000, 3, 'https://www.cyberpowerpc.com/template/2022/page/NVIDIA/GeForceRTX40Series/images/feature-4.png', 2),
('Notebook Gamer Asus', 'ROG Strix con pantalla 144Hz para competitivo.', 990000, 8, 'https://dlcdnwebimgs.asus.com/gain/39290074-E072-46F2-8959-593B6370B309/w1000/h732', 2),

-- Periféricos
('Teclado Mecánico RGB', 'Switches Cherry MX Blue con retroiluminación custom.', 89990, 50, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=500', 3),
('Mouse Logitech G Pro', 'Ultraligero e inalámbrico, usado por pros.', 120000, 25, 'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-black-gallery-1.png?v=1', 3),
('Headset HyperX', 'Sonido envolvente 7.1 para escuchar los pasos.', 65000, 30, 'https://row.hyperx.com/cdn/shop/products/hyperx_cloud_ii_red_1_main_900x.jpg?v=1661292021', 3),

-- Sillas
('Silla Gamer Pro', 'Ergonomía total para largas sesiones de juego.', 180000, 10, 'https://secretlab.co/cdn-cgi/image/width=800,height=800,quality=80,format=auto/uploads/titan_evo_2022_stealth_2023_02.png', 4);

-- 4. NOTICIAS (BLOG)
INSERT INTO blog_posts (titulo, contenido, autor, imagen_url, fecha_publicacion) VALUES 
('Lanzamiento de GTA VI', 'Rockstar confirma la fecha de salida para el próximo año. El hype es real...', 'Admin Supremo', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=500', NOW()),
('Torneo de Valorant', 'Inscríbete en nuestro torneo de comunidad este fin de semana.', 'Vendedor Pro', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=500', NOW());