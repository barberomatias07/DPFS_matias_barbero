-- Acá borro la base si ya existía para no pisar nada viejo y la creo de cero
DROP DATABASE IF EXISTS cultura_nacional_db;
CREATE DATABASE cultura_nacional_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cultura_nacional_db;

-- Me armo la tabla de roles para diferenciar si el usuario es admin o cliente común
CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabla principal de usuarios con la clave foránea apuntando a su rol
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL DEFAULT 'avatar-default.png',
    role_id INT UNSIGNED NOT NULL DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- Categorías de las prendas (remeras, buzos, accesorios, etc.)
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabla principal de productos vinculada a su categoría
CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    frase VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL DEFAULT 'default-product.png',
    category_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- Tabla aparte para los talles disponibles
CREATE TABLE sizes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Tabla intermedia porque una remera puede tener varios talles y un talle está en varias remeras (relación N:M)
CREATE TABLE product_sizes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    size_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_product_sizes_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_sizes_size FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE CASCADE
) ENGINE=InnoDB;