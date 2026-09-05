#!/bin/bash

# Database Setup Script for MOW Ogun Portal
# This script will help you set up the MySQL database

echo "=== MOW Ogun Portal - Database Setup ==="
echo ""

# Check if MySQL is available
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL command not found. Please ensure MySQL is installed and in your PATH."
    echo "On Windows with XAMPP, you may need to add the MySQL bin directory to your PATH."
    exit 1
fi

echo "Creating database and tables..."
echo ""

# Execute the SQL schema
mysql -u root << 'EOF'
-- Create database
CREATE DATABASE IF NOT EXISTS mow_ogun_portal;
USE mow_ogun_portal;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN', 'USER') DEFAULT 'USER',
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Area Commands table
CREATE TABLE IF NOT EXISTS area_commands (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id VARCHAR(50) PRIMARY KEY,
  registrationId VARCHAR(50) UNIQUE NOT NULL,
  surname VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  middleName VARCHAR(255),
  gender ENUM('Male', 'Female'),
  dateOfBirth DATE,
  maritalStatus VARCHAR(50),
  nationality VARCHAR(100),
  stateOfOrigin VARCHAR(100),
  lgaOfOrigin VARCHAR(100),
  placeOfBirth VARCHAR(255),
  bloodGroup VARCHAR(5),
  genotype VARCHAR(5),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  residentialAddress TEXT,
  stateOfResidence VARCHAR(100),
  lgaOfResidence VARCHAR(100),
  emergencyContactName VARCHAR(255),
  emergencyContactPhone VARCHAR(20),
  emergencyContactRelationship VARCHAR(100),
  membershipNumber VARCHAR(100),
  dateJoined DATE,
  yearJoined INT,
  areaCommandId VARCHAR(50),
  unit VARCHAR(100),
  currentRank VARCHAR(100),
  previousRank VARCHAR(100),
  currentAppointment VARCHAR(100),
  previousAppointment VARCHAR(100),
  training TEXT,
  qualification VARCHAR(255),
  membershipStatus ENUM('Active', 'Inactive', 'Reserve', 'Other'),
  previousCommand VARCHAR(255),
  dateTransferred DATE,
  education VARCHAR(255),
  institution VARCHAR(255),
  course VARCHAR(255),
  occupation VARCHAR(255),
  employer VARCHAR(255),
  officeAddress TEXT,
  skills TEXT,
  certifications TEXT,
  religion VARCHAR(100),
  nextOfKin VARCHAR(255),
  nextOfKinPhone VARCHAR(20),
  nextOfKinAddress TEXT,
  additionalInformation TEXT,
  passportPhotoPath VARCHAR(255),
  registrationStatus ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (areaCommandId) REFERENCES area_commands(id),
  INDEX idx_registrationId (registrationId),
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_registrationStatus (registrationStatus)
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50),
  action VARCHAR(255) NOT NULL,
  entityType VARCHAR(100),
  entityId VARCHAR(50),
  details JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
);

-- Insert default admin user
INSERT IGNORE INTO users (id, name, email, password, role, status) 
VALUES ('admin-1', 'Super Admin', 'admin@mowogun.gov.ng', '$2a$10$VBSxSv5h/042BVwm8Wfo2uMVi80TOxmKqyGlDw1bj.jVYE0q8RmiG', 'SUPER_ADMIN', 'active');

-- Insert default area commands
INSERT IGNORE INTO area_commands (id, name, status) VALUES
('Abeokuta South', 'Abeokuta South', 'active'),
('Abeokuta North', 'Abeokuta North', 'active'),
('Odeda', 'Odeda', 'active'),
('Ado-Odo', 'Ado-Odo Ota', 'active'),
('Ewekoro', 'Ewekoro', 'active'),
('Ifo', 'Ifo', 'active'),
('Ijebu East', 'Ijebu East', 'active'),
('Ijebu North', 'Ijebu North', 'active'),
('Ijebu North East', 'Ijebu North East', 'active'),
('Ijebu-Ode', 'Ijebu-Ode', 'active'),
('Ikenne', 'Ikenne', 'active'),
('Imeko-Afon', 'Imeko-Afon', 'active'),
('Ipokia', 'Ipokia', 'active'),
('Obafemi/Owode', 'Obafemi/Owode', 'active'),
('Odogbolu', 'Odogbolu', 'active'),
('Ogun Waterside', 'Ogun Waterside', 'active'),
('Remo North', 'Remo North', 'active'),
('Sagamu', 'Sagamu (Shagamu)', 'active'),
('Yewa North', 'Yewa North (formerly Egbado North)', 'active'),
('Yewa South', 'Yewa South (formerly Egbado South)', 'active');
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Database setup completed successfully!"
    echo ""
    echo "Default Admin Login:"
    echo "Email: admin@mowogun.gov.ng"
    echo "Password: Admin@123"
    echo ""
else
    echo "ERROR: Failed to create database. Please check your MySQL installation."
    exit 1
fi
