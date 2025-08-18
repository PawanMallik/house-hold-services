-- ServiceHub Database Schema
-- This schema supports user authentication and personalized booking history

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Services table
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    duration_hours DECIMAL(3, 1),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service providers/technicians table
CREATE TABLE technicians (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    specialization VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table - core table linking users to services
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    technician_id INT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    service_address TEXT NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    special_notes TEXT,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (technician_id) REFERENCES technicians(id)
);

-- Reviews table for rating services
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    technician_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES technicians(id)
);

-- User sessions table for authentication
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample services
INSERT INTO services (name, description, base_price, duration_hours, category) VALUES
('AC Repair & Maintenance', 'Professional AC repair, maintenance, and installation services', 89.00, 2.5, 'HVAC'),
('House Cleaning', 'Complete house cleaning service including bathrooms, kitchen, and living areas', 75.00, 3.5, 'Cleaning'),
('Plumbing Services', 'Fix leaks, unclog drains, install fixtures, and emergency repairs', 95.00, 1.5, 'Plumbing'),
('Electrical Work', 'Electrical repairs, outlet installation, and safety inspections', 120.00, 2.0, 'Electrical'),
('Painting Services', 'Interior and exterior painting with premium quality materials', 200.00, 5.0, 'Painting'),
('Appliance Repair', 'Repair services for washing machines, refrigerators, and other appliances', 85.00, 1.5, 'Appliances');

-- Insert sample technicians
INSERT INTO technicians (full_name, phone, email, specialization, rating, total_reviews) VALUES
('John Smith', '+1-555-0101', 'john.smith@servicehub.com', 'HVAC Specialist', 4.8, 127),
('Mary Johnson', '+1-555-0102', 'mary.johnson@servicehub.com', 'House Cleaning Expert', 4.9, 203),
('Mike Wilson', '+1-555-0103', 'mike.wilson@servicehub.com', 'Master Plumber', 4.7, 89),
('Sarah Davis', '+1-555-0104', 'sarah.davis@servicehub.com', 'Licensed Electrician', 4.6, 156),
('Tom Brown', '+1-555-0105', 'tom.brown@servicehub.com', 'Professional Painter', 4.8, 94),
('Lisa Garcia', '+1-555-0106', 'lisa.garcia@servicehub.com', 'Appliance Technician', 4.5, 67);

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Views for common queries
CREATE VIEW user_booking_history AS
SELECT 
    b.id,
    b.user_id,
    u.full_name as customer_name,
    s.name as service_name,
    t.full_name as technician_name,
    b.booking_date,
    b.booking_time,
    b.service_address,
    b.status,
    b.total_price,
    b.created_at,
    s.duration_hours,
    t.rating as technician_rating
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN services s ON b.service_id = s.id
LEFT JOIN technicians t ON b.technician_id = t.id
ORDER BY b.created_at DESC;