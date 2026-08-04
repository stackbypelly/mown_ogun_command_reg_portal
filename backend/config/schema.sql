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
  
  -- Personal Information
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
  
  -- Contact Information
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  residentialAddress TEXT,
  stateOfResidence VARCHAR(100),
  lgaOfResidence VARCHAR(100),
  
  -- Emergency Contact
  emergencyContactName VARCHAR(255),
  emergencyContactPhone VARCHAR(20),
  emergencyContactRelationship VARCHAR(100),
  
  -- Man O' War Information
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
  
  -- Education & Occupation
  education VARCHAR(255),
  institution VARCHAR(255),
  course VARCHAR(255),
  occupation VARCHAR(255),
  employer VARCHAR(255),
  officeAddress TEXT,
  skills TEXT,
  certifications TEXT,
  
  -- Additional Information
  religion VARCHAR(100),
  nextOfKin VARCHAR(255),
  nextOfKinPhone VARCHAR(20),
  nextOfKinAddress TEXT,
  additionalInformation TEXT,
  
  -- Document
  passportPhotoPath VARCHAR(255),
  
  -- Status
  rejectionReason TEXT,
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
INSERT INTO users (id, name, email, password, role, status) 
SELECT * FROM (SELECT 
  'admin-1' as id,
  'Super Admin' as name,
  'admin@mowogun.gov.ng' as email,
  '$2a$10$2VrwEHN35e4imvsg3ALUOuvUHJnLo2HlE8bsGTTB4Cdpne0XdOLuK' as password,
  'SUPER_ADMIN' as role,
  'active' as status
) as new_user
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@mowogun.gov.ng');

-- Insert default area commands
INSERT INTO area_commands (id, name, status) VALUES
('ac-1', 'Abeokuta South', 'active'),
('ac-2', 'Abeokuta North', 'active'),
('ac-3', 'Odeda', 'active'),
('ac-4', 'Ado-Odo Ota', 'active'),
('ac-5', 'Ewekoro', 'active'),
('ac-6', 'Ifo', 'active'),
('ac-7', 'Ijebu East', 'active'),
('ac-8', 'Ijebu North', 'active'),
('ac-9', 'Ijebu North East', 'active'),
('ac-10', 'Ijebu-Ode', 'active'),
('ac-11', 'Ikenne', 'active'),
('ac-12', 'Imeko-Afon', 'active'),
('ac-13', 'Ipokia', 'active'),
('ac-14', 'Obafemi/Owode', 'active'),
('ac-15', 'Odogbolu', 'active'),
('ac-16', 'Ogun Waterside', 'active'),
('ac-17', 'Remo North', 'active'),
('ac-18', 'Sagamu (Shagamu)', 'active'),
('ac-19', 'Yewa North (formerly Egbado North)', 'active'),
('ac-20', 'Yewa South (formerly Egbado South)', 'active')
ON DUPLICATE KEY UPDATE id=id;