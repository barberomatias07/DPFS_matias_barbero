USE cultura_nacional_db;

-- Cargo primero los dos roles básicos
INSERT INTO roles (id, name) VALUES
(1, 'admin'),
(2, 'customer');

-- Cargo mi usuario administrador (con la contraseña ya encriptada) y uno de prueba
INSERT INTO users (id, full_name, email, password, avatar, role_id) VALUES
(1, 'Matias Barbero', 'barberomatias07@gmail.com', '$2b$10$brBs3NoPrCceLy9YcBBTH.zlPjIEklKw4PjNpHucXH65tpyZxjsdC', 'avatar-1794937377560.jpg', 1),
(2, 'Militante Prueba', 'cliente@culturanacional.com', '$2b$10$l5TB5jxSSrwDkkMqxT/HHeNpU7a/K3bAnw.nEOm6jPnskPMwpufUS', 'avatar-default.png', 2);

-- Cargo las categorías de la tienda
INSERT INTO categories (id, name) VALUES
(1, 'Remera'),
(2, 'Buzo'),
(3, 'Accesorio');

-- Cargo los talles que manejo
INSERT INTO sizes (id, name) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL');

-- Migro todas mis remeras que tenía en el JSON a la tabla products
INSERT INTO products (id, name, frase, description, price, image, category_id) VALUES
(1, 'Ernesto "Che" Guevara', '"Hasta la victoria siempre"', 'Frase inmortalizada en su carta de despedida a Fidel Castro, símbolo universal de la lucha antiimperialista y la emancipación de los pueblos.', 18000.00, 'che.jpg.jpeg', 1),
(2, 'Dr. René Favaloro', '"Honestidad, responsabilidad y solidaridad"', 'Estandarte ético frente a la corrupción estructural y el vaciamiento de la salud y la educación pública en la Argentina.', 18000.00, 'favaloro.jpg.jpeg', 1),
(3, 'José Font "Patón" Soto', '"A triunfar definitivamente..."', 'A triunfar definitivamente...', 18000.00, 'soto.jpg.jpeg', 1),
(4, 'Juan Bautista Bairoletto', '"Viviré en el alma del pueblo"', 'Bandido rural y justicia criollo de la década del ''30, protector de los desposeídos frente a los abusos de los terratenientes.', 18000.00, 'bairoletto.jpg.jpeg', 1),
(5, 'Facón Grande (Huelgas Patagónicas)', '"Así no se mata a un criollo"', 'Reclamo histórico exigiendo dignidad y respeto por la vida de los trabajadores rurales explotados en la Patagonia trágica.', 18000.00, 'facon.jpg.jpeg', 1),
(6, 'Indio Solari / Patricio Rey', '"Festejamos nuestra independencia"', 'Himno del rock contestatario sobre la autonomía mental, la autogestión y el cuidado de la libertad frente al aparato hegemónico.', 18000.00, 'indio.jpg.jpeg', 1),
(7, 'Karl Marx', '"Nothing to lose but your chains"', 'Cierre del Manifiesto Comunista, llamado universal a la abolición de la explotación asalariada y la emancipación obrera.', 18000.00, 'marx.jpg.jpeg', 1),
(8, 'Nunca mas', 'Nuevo diseño', '9 de diciembre de 1982, las Madres enfrentando a las fuerzas que les impedían ingresar a la Plaza para marchar por el Día Internacional de los Derechos Humanos.', 18000.00, 'remera-1794011980969.jpg', 1),
(9, 'Maria Elena Walsh', 'Nuevo diseño', 'La canción se interpreta como una crítica a la sociedad consumista y a la forma en que nos empuja a desear y comprar cosas materiales, cuando lo que un pibe necesita es tiempo suelto, no enjaulado adentro de un despertador, para jugar, imaginar y que le hablen.', 18000.00, 'remera-1794012890013.jpeg', 1);

-- Acá cruzo cada producto con los talles que tiene disponibles (1=S, 2=M, 3=L, 4=XL)
INSERT INTO product_sizes (product_id, size_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1), (3, 2), (3, 3), (3, 4),
(4, 1), (4, 2), (4, 3), (4, 4),
(5, 1), (5, 2), (5, 3), (5, 4),
(6, 1), (6, 2), (6, 3), (6, 4),
(7, 1), (7, 2), (7, 3), (7, 4),
(8, 4),
(9, 3);