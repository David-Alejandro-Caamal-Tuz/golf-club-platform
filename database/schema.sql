-- Eliminar tablas si ya existen (orden inverso por las llaves foráneas)
DROP TABLE IF EXISTS tee_time_bookings;
DROP TABLE IF EXISTS golf_courses;
DROP TABLE IF EXISTS members;

-- 1. Tabla de Socios / Miembros del Club
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    membership_type VARCHAR(50) DEFAULT 'STANDARD', -- 'STANDARD', 'VIP', 'HONORARY'
    handicap DECIMAL(3,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Campos de Golf
CREATE TABLE golf_courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_holes INT DEFAULT 18,
    par_total INT DEFAULT 72,
    location VARCHAR(150)
);

-- 3. Tabla de Reservas de Salidas (Tee Times)
CREATE TABLE tee_time_bookings (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES golf_courses(id) ON DELETE CASCADE,
    member_id INT REFERENCES members(id) ON DELETE CASCADE,
    booking_time TIMESTAMP NOT NULL,
    players_count INT CHECK (players_count BETWEEN 1 AND 4), -- Máximo 4 jugadores por salida
    status VARCHAR(20) DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'CANCELLED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba iniciales (Seed data)
INSERT INTO golf_courses (name, total_holes, par_total, location) 
VALUES ('Championship Golf Course', 18, 72, 'Hoyo Principal - Zona Norte');

INSERT INTO members (first_name, last_name, email, membership_type, handicap) 
VALUES ('Carlos', 'Pérez', 'carlos.perez@email.com', 'VIP', 12.5);