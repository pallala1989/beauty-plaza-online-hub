
-- Beauty Plaza Complete Database Setup
-- This file contains all the necessary SQL queries to set up your MySQL database

-- Create database
CREATE DATABASE IF NOT EXISTS beauty_plaza;
USE beauty_plaza;

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS technician_specialties;
DROP TABLE IF EXISTS technicians;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS customers;

-- Create customers table
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create technicians table
CREATE TABLE technicians (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialties JSON,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    customer_id BIGINT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service_type ENUM('in-store', 'in-home') DEFAULT 'in-store',
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    total_amount DECIMAL(10,2),
    otp_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (technician_id) REFERENCES technicians(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create settings table
CREATE TABLE settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value JSON NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_technician ON appointments(technician_id);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_technicians_available ON technicians(is_available);
CREATE INDEX idx_customers_email ON customers(email);

-- Insert sample services data
INSERT INTO services (name, description, price, duration, image_url, is_active) VALUES
('Classic Facial', 'Deep cleansing facial with extractions and moisturizing treatment', 75.00, 60, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop', TRUE),
('Anti-Aging Facial', 'Rejuvenating treatment with collagen boost and peptide infusion', 120.00, 75, 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop', TRUE),
('Haircut & Style', 'Professional cut with wash, style, and finishing', 45.00, 45, 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop', TRUE),
('Hair Color', 'Full color service with professional consultation', 85.00, 120, 'https://images.unsplash.com/photo-1560869713-7d0954430927?w=400&h=300&fit=crop', TRUE),
('Bridal Makeup', 'Complete bridal makeup with trial session included', 150.00, 90, 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=300&fit=crop', TRUE),
('Special Event Makeup', 'Professional makeup for parties and special occasions', 60.00, 45, 'https://images.unsplash.com/photo-1498950608760-8d97161f8c1c?w=400&h=300&fit=crop', TRUE),
('Eyebrow Waxing', 'Precise eyebrow shaping and grooming', 25.00, 20, 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=400&h=300&fit=crop', TRUE),
('Full Leg Waxing', 'Complete leg hair removal with soothing after-care', 65.00, 45, 'https://images.unsplash.com/photo-1610899922902-99a4b4c5b1b7?w=400&h=300&fit=crop', TRUE),
('Manicure', 'Classic manicure with nail shaping and polish', 35.00, 30, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop', TRUE),
('Gel Manicure', 'Long-lasting gel polish with UV curing', 45.00, 45, 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=300&fit=crop', TRUE);

-- Insert sample technicians data
INSERT INTO technicians (name, specialties, is_available) VALUES
('Sarah Johnson', JSON_ARRAY('Facial', 'Anti-Aging'), TRUE),
('Emma Davis', JSON_ARRAY('Hair', 'Color'), TRUE),
('Lisa Chen', JSON_ARRAY('Makeup', 'Bridal'), TRUE),
('Maria Rodriguez', JSON_ARRAY('Waxing', 'Nails'), TRUE),
('Jessica Lee', JSON_ARRAY('Hair', 'Facial'), TRUE),
('Amanda Thompson', JSON_ARRAY('Nails', 'Makeup'), TRUE);

-- Insert sample customers
INSERT INTO customers (name, email, phone, loyalty_points) VALUES
('John Doe', 'john.doe@email.com', '+1234567890', 150),
('Jane Smith', 'jane.smith@email.com', '+1234567891', 300),
('Mike Johnson', 'mike.johnson@email.com', '+1234567892', 75),
('Emily Brown', 'emily.brown@email.com', '+1234567893', 200),
('David Wilson', 'david.wilson@email.com', '+1234567894', 50);

-- Insert settings data
INSERT INTO settings (setting_key, setting_value, description) VALUES
('service_prices', JSON_OBJECT('facial', 75, 'haircut', 50, 'manicure', 35, 'pedicure', 45), 'Base prices for services'),
('referral_amounts', JSON_OBJECT('referrer_credit', 10, 'referred_discount', 10), 'Referral program amounts'),
('loyalty_settings', JSON_OBJECT('points_per_dollar', 10, 'min_redemption', 100, 'redemption_rate', 10), 'Loyalty program configuration'),
('in_home_fee', '25', 'Additional fee for in-home services'),
('loyalty_tiers', JSON_OBJECT('bronze', 0, 'silver', 500, 'gold', 1000, 'platinum', 2000), 'Loyalty tier point thresholds'),
('contact_info', JSON_OBJECT('phone', '(903) 921-0271', 'email', 'info@beautyplaza.com', 'address_line1', '2604 Jacqueline Dr', 'address_line2', 'Wilmington, DE - 19810'), 'Business contact information'),
('business_hours', JSON_OBJECT('monday', '9:00-18:00', 'tuesday', '9:00-18:00', 'wednesday', '9:00-18:00', 'thursday', '9:00-18:00', 'friday', '9:00-19:00', 'saturday', '8:00-17:00', 'sunday', 'closed'), 'Business operating hours');

-- Insert sample appointments
INSERT INTO appointments (service_id, technician_id, customer_id, customer_name, customer_email, customer_phone, appointment_date, appointment_time, service_type, status, total_amount) VALUES
(1, 1, 1, 'John Doe', 'john.doe@email.com', '+1234567890', '2024-01-20', '10:00:00', 'in-store', 'confirmed', 75.00),
(3, 2, 2, 'Jane Smith', 'jane.smith@email.com', '+1234567891', '2024-01-21', '14:00:00', 'in-store', 'scheduled', 45.00),
(5, 3, 3, 'Mike Johnson', 'mike.johnson@email.com', '+1234567892', '2024-01-22', '11:00:00', 'in-home', 'confirmed', 175.00),
(2, 1, 4, 'Emily Brown', 'emily.brown@email.com', '+1234567893', '2024-01-23', '15:30:00', 'in-store', 'scheduled', 120.00),
(4, 2, 5, 'David Wilson', 'david.wilson@email.com', '+1234567894', '2024-01-24', '09:00:00', 'in-store', 'confirmed', 85.00);

-- Create a health check endpoint simulation (for Spring Boot compatibility)
-- This is handled by your Spring Boot application, but here's what the data structure should return

-- Query to check backend connectivity (what your Spring Boot /api/health should return)
-- SELECT 'OK' as status, NOW() as timestamp;

-- Query to get all active services (what your Spring Boot /api/services should return)
-- SELECT id, name, description, price, duration, image_url, is_active, created_at, updated_at 
-- FROM services WHERE is_active = TRUE ORDER BY name;

-- Query to get all available technicians (what your Spring Boot /api/technicians should return)
-- SELECT id, name, specialties, is_available, created_at, updated_at 
-- FROM technicians WHERE is_available = TRUE ORDER BY name;

-- Query to get booked slots for a technician in a date range
-- SELECT appointment_date, appointment_time, status 
-- FROM appointments 
-- WHERE technician_id = ? 
-- AND appointment_date BETWEEN ? AND ? 
-- AND status IN ('scheduled', 'confirmed')
-- ORDER BY appointment_date, appointment_time;

-- Query to get all settings (what your Spring Boot /api/admin/settings should return)
-- SELECT setting_key, setting_value FROM settings;

COMMIT;
