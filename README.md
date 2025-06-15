
# Beauty Salon Booking System

## Project info

**URL**: https://lovable.dev/projects/75c8fd3e-47e9-4af3-a7f2-5c680eb63d3f

## Overview

A comprehensive beauty salon booking system built with React, TypeScript, and Supabase. Features online appointment booking, customer management, loyalty programs, and administrative controls.

## Current Architecture (Frontend + Supabase)

### Frontend Technologies
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn-ui** component library
- **React Router** for navigation
- **React Query** for state management

### Backend (Supabase)
- **PostgreSQL** database
- **Authentication** with Row Level Security
- **Real-time subscriptions**
- **Edge Functions** for custom logic

## How to Run Current Application

### Use Lovable (Recommended)
Simply visit the [Lovable Project](https://lovable.dev/projects/75c8fd3e-47e9-4af3-a7f2-5c680eb63d3f) and start prompting.

### Local Development
```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Spring Boot Backend Integration Guide

### Why Consider Spring Boot Backend?

While the current Supabase solution works well, you might want a Spring Boot backend for:
- **Enterprise Integration**: Better integration with existing Java/Spring systems
- **Custom Business Logic**: Complex business rules that are easier to implement in Java
- **Performance**: Optimized queries and caching strategies
- **Security**: Enhanced security controls and audit trails
- **Third-party Integrations**: Easier integration with enterprise systems

### Spring Boot Application Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── salon/
│   │           ├── SalonBookingApplication.java
│   │           ├── config/
│   │           │   ├── SecurityConfig.java
│   │           │   ├── CorsConfig.java
│   │           │   └── JpaConfig.java
│   │           ├── controller/
│   │           │   ├── AuthController.java
│   │           │   ├── AppointmentController.java
│   │           │   ├── ServiceController.java
│   │           │   ├── TechnicianController.java
│   │           │   ├── CustomerController.java
│   │           │   ├── LoyaltyController.java
│   │           │   ├── GiftCardController.java
│   │           │   ├── PromotionController.java
│   │           │   └── AdminController.java
│   │           ├── model/
│   │           │   ├── User.java
│   │           │   ├── Appointment.java
│   │           │   ├── Service.java
│   │           │   ├── Technician.java
│   │           │   ├── Customer.java
│   │           │   ├── LoyaltyPoints.java
│   │           │   ├── GiftCard.java
│   │           │   ├── Promotion.java
│   │           │   └── Settings.java
│   │           ├── repository/
│   │           │   ├── UserRepository.java
│   │           │   ├── AppointmentRepository.java
│   │           │   ├── ServiceRepository.java
│   │           │   ├── TechnicianRepository.java
│   │           │   ├── CustomerRepository.java
│   │           │   ├── LoyaltyPointsRepository.java
│   │           │   ├── GiftCardRepository.java
│   │           │   ├── PromotionRepository.java
│   │           │   └── SettingsRepository.java
│   │           ├── service/
│   │           │   ├── AuthService.java
│   │           │   ├── AppointmentService.java
│   │           │   ├── BookingService.java
│   │           │   ├── NotificationService.java
│   │           │   ├── LoyaltyService.java
│   │           │   └── EmailService.java
│   │           └── dto/
│   │               ├── LoginRequest.java
│   │               ├── RegisterRequest.java
│   │               ├── AppointmentRequest.java
│   │               ├── BookingResponse.java
│   │               └── ApiResponse.java
│   └── resources/
│       ├── application.yml
│       └── data.sql
```

### Required Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
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
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    
    <!-- JWT -->
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
</dependencies>
```

### Database Schema (MySQL)

```sql
CREATE DATABASE salon_booking;

-- Users table (replaces auth.users)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer', 'technician', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Technicians table
CREATE TABLE technicians (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    specialties JSON,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Appointments table
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    service_id VARCHAR(36) NOT NULL,
    technician_id VARCHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service_type ENUM('in-store', 'in-home') DEFAULT 'in-store',
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled',
    total_amount DECIMAL(10,2),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    notes TEXT,
    otp_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_booking (technician_id, appointment_date, appointment_time),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (technician_id) REFERENCES technicians(id)
);

-- Other tables (loyalty_points, gift_cards, promotions, referrals, settings)
-- Similar structure to Supabase tables but with MySQL syntax
```

### Core API Endpoints

#### Authentication Controller
```java
POST   /api/auth/register         - User registration
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
POST   /api/auth/refresh         - Refresh JWT token
POST   /api/auth/forgot-password - Password reset request
POST   /api/auth/reset-password  - Password reset confirmation
```

#### Appointment Controller
```java
GET    /api/appointments                    - Get user appointments
POST   /api/appointments                    - Create new appointment
PUT    /api/appointments/{id}               - Update appointment
DELETE /api/appointments/{id}               - Cancel appointment
GET    /api/appointments/{id}               - Get appointment details
GET    /api/appointments/available-slots    - Get available time slots
```

#### Service Controller
```java
GET    /api/services           - Get all active services
GET    /api/services/{id}      - Get service details
POST   /api/services           - Create service (admin)
PUT    /api/services/{id}      - Update service (admin)
DELETE /api/services/{id}      - Delete service (admin)
```

#### Technician Controller
```java
GET    /api/technicians                    - Get all available technicians
GET    /api/technicians/{id}               - Get technician details
GET    /api/technicians/{id}/availability  - Get technician availability
POST   /api/technicians                    - Create technician (admin)
PUT    /api/technicians/{id}               - Update technician (admin)
```

#### Booking Controller
```java
POST   /api/booking/check-availability     - Check slot availability
POST   /api/booking/hold-slot              - Temporarily hold a slot
POST   /api/booking/confirm                - Confirm booking
GET    /api/booking/booked-slots           - Get booked slots for date/technician
```

#### Loyalty Controller
```java
GET    /api/loyalty/points                 - Get user loyalty points
POST   /api/loyalty/redeem                 - Redeem loyalty points
GET    /api/loyalty/history                - Get loyalty history
```

### Frontend Integration Changes

To integrate with Spring Boot backend, you'll need to modify these files:

#### 1. API Configuration
```typescript
// src/config/api.ts - NEW FILE NEEDED
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-spring-app.herokuapp.com/api'
  : 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 2. Authentication Context Changes
```typescript
// src/contexts/AuthContext.tsx - MAJOR CHANGES NEEDED
// Replace Supabase auth with JWT-based authentication
// Update login, register, logout methods to call Spring Boot APIs
```

#### 3. Data Fetching Hooks Changes
```typescript
// src/hooks/useBookingData.ts - REPLACE SUPABASE CALLS
// Replace supabase.from() calls with axios API calls
// Update fetchServices, fetchTechnicians, fetchBookedSlots methods

// src/hooks/useSettings.ts - REPLACE SUPABASE CALLS  
// Replace Supabase RPC calls with REST API calls

// src/hooks/useAppointments.ts - REPLACE SUPABASE CALLS
// Replace all Supabase queries with Spring Boot API calls
```

#### 4. Booking Actions Changes
```typescript
// src/hooks/booking/useBookingActions.ts - MAJOR CHANGES
// Replace handleSubmit method to call Spring Boot booking API
// Update error handling for REST API responses
// Replace Supabase appointment creation with API calls
```

#### 5. Components Requiring Changes
```typescript
// Components that need API integration updates:
// - src/pages/Login.tsx
// - src/pages/Register.tsx  
// - src/pages/Profile.tsx
// - src/pages/MyBookings.tsx
// - src/pages/AdminDashboard.tsx
// - src/components/booking/* (all booking components)
```

### Integration Steps

1. **Create Spring Boot Application**
   ```bash
   # Generate project from Spring Initializr
   curl https://start.spring.io/starter.zip \
     -d dependencies=web,data-jpa,security,validation,mail,mysql \
     -d groupId=com.salon \
     -d artifactId=booking-backend \
     -d name=salon-booking-backend \
     -d packageName=com.salon.booking \
     -o salon-booking-backend.zip
   ```

2. **Set up MySQL Database**
   - Install MySQL locally or use cloud service
   - Create database and tables using provided schema
   - Configure application.yml with database credentials

3. **Implement Core Controllers and Services**
   - Start with AuthController and UserService
   - Implement AppointmentController and BookingService
   - Add other controllers progressively

4. **Update Frontend Configuration**
   - Create API configuration file
   - Replace Supabase client with axios
   - Update environment variables

5. **Migrate Authentication**
   - Implement JWT-based authentication
   - Update AuthContext to use REST APIs
   - Test login/register flows

6. **Migrate Data Operations**
   - Replace Supabase queries in hooks
   - Update booking flow to use REST APIs
   - Test all CRUD operations

7. **Deploy Both Applications**
   - Deploy Spring Boot to Heroku/AWS/Azure
   - Update frontend environment variables
   - Configure CORS settings

### Benefits of Spring Boot Backend

- **Familiar Java ecosystem** for enterprise developers
- **Better performance** with optimized queries and caching
- **Enhanced security** with Spring Security
- **Easier integration** with existing enterprise systems
- **Better testing** with Spring Boot Test framework
- **Production-ready** monitoring and health checks

### Considerations

- **Increased complexity** - maintaining two separate applications
- **Additional deployment** - need to deploy and monitor backend separately  
- **Development time** - significant effort to migrate existing functionality
- **Learning curve** - if team isn't familiar with Spring Boot

The current Supabase solution is already production-ready and handles most use cases effectively. Consider Spring Boot backend only if you have specific enterprise requirements or existing Java infrastructure.
