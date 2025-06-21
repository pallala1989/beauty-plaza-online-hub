
# Complete Spring Boot Backend Implementation Prompt

This document provides a comprehensive prompt that can be used by AI systems to generate a complete Spring Boot backend for the Beauty Plaza application.

## System Prompt

You are an expert Spring Boot developer tasked with creating a complete backend system for a Beauty Plaza appointment booking application. Generate all necessary Java code, configuration files, and database scripts based on the specifications below.

## Application Requirements

### Core Features
1. **User Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (admin, technician, user)
   - Password encryption using BCrypt
   - Admin bypass credentials for testing

2. **Appointment Management System**
   - Book, reschedule, cancel appointments
   - Real-time availability checking
   - Status management (scheduled, confirmed, completed, cancelled, paid)
   - Payment restrictions based on status

3. **Service & Technician Management**
   - CRUD operations for services
   - CRUD operations for technicians
   - Image URL management
   - Availability tracking

4. **Payment & Loyalty System**
   - Payment processing integration
   - Loyalty points calculation and redemption
   - Gift card management
   - Referral program

5. **Settings Management**
   - Dynamic configuration management
   - Business hours configuration
   - Navigation settings
   - Pricing and fee management

## Technical Stack Requirements

### Core Technologies
- **Spring Boot 3.2+**
- **Spring Security 6+**
- **Spring Data JPA**
- **MySQL 8.0+**
- **Maven** for dependency management
- **JWT** for authentication
- **Jackson** for JSON processing

### Additional Dependencies
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```

## Database Schema Requirements

### Core Entities

#### 1. User Entity
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    role ENUM('admin', 'technician', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. Services Entity
```sql
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. Technicians Entity
```sql
CREATE TABLE technicians (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialties JSON,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 4. Appointments Entity
```sql
CREATE TABLE appointments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(255) NOT NULL,
    service_id BIGINT NOT NULL,
    technician_id VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service_type ENUM('in-store', 'in-home') NOT NULL,
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'paid') DEFAULT 'scheduled',
    notes TEXT,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    total_amount DECIMAL(10,2),
    loyalty_points_used INTEGER DEFAULT 0,
    loyalty_discount DECIMAL(10,2) DEFAULT 0.00,
    otp_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (technician_id) REFERENCES technicians(id)
);
```

#### 5. Settings Entity
```sql
CREATE TABLE settings (
    setting_key VARCHAR(255) PRIMARY KEY,
    setting_value JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 6. Loyalty Points Entity
```sql
CREATE TABLE loyalty_points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    transaction_type ENUM('earned', 'redeemed') NOT NULL,
    points INTEGER NOT NULL,
    description VARCHAR(500),
    appointment_id BIGINT NULL,
    redemption_method ENUM('gift_card', 'bank_credit') NULL,
    bank_account VARCHAR(255) NULL,
    routing_number VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);
```

## API Endpoints Specification

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/services` - Get all active services
- `GET /api/services/{id}` - Get service by ID
- `GET /api/technicians` - Get all available technicians
- `GET /api/appointments/slots` - Get available time slots

### Protected Endpoints

#### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/user/{userId}` - Get user appointments
- `PUT /api/appointments/{id}/cancel` - Cancel appointment
- `PUT /api/appointments/{id}/reschedule` - Reschedule appointment

#### Admin Endpoints
- `GET /api/admin/appointments` - Get all appointments
- `PUT /api/admin/appointments/{id}/status` - Update appointment status
- `GET /api/admin/settings` - Get all settings
- `POST /api/admin/settings/{key}` - Update setting
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/{id}` - Update service
- `DELETE /api/admin/services/{id}` - Delete service
- `POST /api/admin/technicians` - Create technician
- `PUT /api/admin/technicians/{id}` - Update technician
- `DELETE /api/admin/technicians/{id}` - Delete technician

### Loyalty System
- `POST /api/loyalty/redeem` - Redeem loyalty points
- `GET /api/loyalty/balance/{userId}` - Get points balance
- `GET /api/loyalty/history/{userId}` - Get points history

## Implementation Requirements

### 1. Project Structure
Generate a complete Maven project with the following structure:
```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── beautyplaza/
│   │           ├── BeautyPlazaApplication.java
│   │           ├── config/
│   │           │   ├── SecurityConfig.java
│   │           │   ├── JwtConfig.java
│   │           │   └── CorsConfig.java
│   │           ├── controller/
│   │           │   ├── AuthController.java
│   │           │   ├── AppointmentController.java
│   │           │   ├── ServiceController.java
│   │           │   ├── TechnicianController.java
│   │           │   ├── AdminController.java
│   │           │   └── LoyaltyController.java
│   │           ├── entity/
│   │           │   ├── User.java
│   │           │   ├── Appointment.java
│   │           │   ├── Service.java
│   │           │   ├── Technician.java
│   │           │   ├── Settings.java
│   │           │   └── LoyaltyPoints.java
│   │           ├── repository/
│   │           │   ├── UserRepository.java
│   │           │   ├── AppointmentRepository.java
│   │           │   ├── ServiceRepository.java
│   │           │   ├── TechnicianRepository.java
│   │           │   ├── SettingsRepository.java
│   │           │   └── LoyaltyPointsRepository.java
│   │           ├── service/
│   │           │   ├── AuthService.java
│   │           │   ├── AppointmentService.java
│   │           │   ├── ServiceService.java
│   │           │   ├── TechnicianService.java
│   │           │   ├── SettingsService.java
│   │           │   └── LoyaltyService.java
│   │           ├── dto/
│   │           │   ├── request/
│   │           │   └── response/
│   │           ├── exception/
│   │           │   ├── GlobalExceptionHandler.java
│   │           │   └── CustomExceptions.java
│   │           └── util/
│   │               ├── JwtUtil.java
│   │               └── DateTimeUtil.java
│   └── resources/
│       ├── application.properties
│       └── data.sql
└── test/
    └── java/
        └── com/
            └── beautyplaza/
                └── BeautyPlazaApplicationTests.java
```

### 2. Security Configuration
- Implement JWT-based authentication
- Configure CORS for frontend integration
- Set up role-based access control
- Implement admin bypass for testing

### 3. Business Logic Requirements

#### Appointment Management
- Prevent double-booking of technicians
- Implement appointment status workflow
- Restrict modifications based on appointment status
- Calculate total amounts including fees and discounts

#### Payment Integration
- Track payment status
- Prevent duplicate payments
- Handle loyalty point redemption
- Apply discounts and fees

#### Settings Management
- Dynamic configuration loading
- Real-time settings updates
- Validation for setting values
- Default values for missing settings

### 4. Data Validation
- Input validation for all endpoints
- Business rule validation
- Date and time validation
- Email and phone number validation

### 5. Error Handling
- Global exception handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for development

### 6. Sample Data
Generate sample data insertion scripts including:
- Default admin users
- Sample services with realistic pricing
- Sample technicians
- Default settings configuration

## Configuration Requirements

### Application Properties
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/beauty_plaza
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# Server Configuration
server.port=8080

# CORS Configuration
cors.allowed-origins=http://localhost:3000,https://preview--beauty-plaza-online-hub.lovable.app

# Logging
logging.level.com.beautyplaza=DEBUG
```

### Docker Configuration
Provide Docker and Docker Compose files for easy deployment.

## Testing Requirements
- Unit tests for all service classes
- Integration tests for API endpoints
- Test data fixtures
- Security testing for authentication and authorization

## Documentation Requirements
- Comprehensive README.md
- API documentation (Swagger/OpenAPI)
- Database schema documentation
- Deployment instructions

## Additional Features to Implement
1. **Email Notifications** - Appointment confirmations and reminders
2. **SMS Integration** - OTP verification and notifications
3. **Image Upload** - Service and technician photo management
4. **Reporting** - Business analytics and reports
5. **Audit Logging** - Track all system changes
6. **Rate Limiting** - API rate limiting for security
7. **Caching** - Redis integration for performance
8. **Health Monitoring** - Actuator endpoints for monitoring

## Success Criteria
The generated Spring Boot application should:
1. Compile and run without errors
2. Pass all integration tests
3. Properly handle authentication and authorization
4. Implement all required business logic
5. Follow Spring Boot best practices
6. Include comprehensive error handling
7. Support the complete frontend application workflow
8. Be production-ready with proper configuration

Generate complete, production-ready code that implements all the above requirements. Ensure the code follows Java and Spring Boot best practices, includes proper documentation, and is ready for deployment.
