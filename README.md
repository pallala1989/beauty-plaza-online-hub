
# Beauty Plaza - Full Stack Booking Application

This repository contains the code for Beauty Plaza, a full-stack web application for a beauty salon. It includes a React frontend and a Spring Boot backend.

## Frontend (React + Vite)

The frontend is built with React, Vite, TypeScript, Tailwind CSS, and Shadcn UI components.

### Key Features
- Service browsing and selection
- Online appointment booking flow
- Customer authentication (Login/Register via OAuth)
- User profile management (view bookings, update info)
- Admin dashboard for managing services, technicians, and settings.

## Backend (Spring Boot)

The backend is a Spring Boot application that provides a RESTful API for the frontend. It is designed to be secured using OAuth2.

### Architecture
- **Controller Layer**: Handles HTTP requests and responses.
- **Service Layer**: Contains business logic.
- **Repository Layer**: Interacts with the database using Spring Data JPA.
- **Model/Entity Layer**: Defines the data structures.
- **DTOs**: Data Transfer Objects for clean API contracts.
- **Security**: OAuth2 for authentication and authorization.

### Database Schema
The application uses a PostgreSQL database with the following main tables:
- `services`
- `technicians`
- `appointments`
- `users` (from Supabase Auth)
- `profiles`
- `promotions`
- `gift_cards`
- `loyalty_points`

### API Endpoints
- `GET /api/services`
- `GET /api/technicians`
- `GET /api/appointments/slots`
- `POST /api/appointments/book`
- `GET /api/admin/settings`
- `POST /api/admin/settings`

---

### Backend Setup and Configuration

#### `pom.xml` (Dependencies)
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
        <artifactId>spring-boot-starter-oauth2-client</artifactId>
    </dependency>

    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

#### `application.properties`
```properties
# Database Connection (replace with your Supabase DB credentials)
spring.datasource.url=jdbc:postgresql://<your_supabase_db_host>:<port>/postgres
spring.datasource.username=postgres
spring.datasource.password=<your_supabase_db_password>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Spring Security OAuth2 Client Configuration (Example for Google)
spring.security.oauth2.client.registration.google.client-id=<your-google-client-id>
spring.security.oauth2.client.registration.google.client-secret=<your-google-client-secret>
spring.security.oauth2.client.registration.google.scope=openid,profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/{registrationId}
```

#### Security Configuration (`SecurityConfig.java`)
```java
package com.beautyplaza.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(
                    "/", 
                    "/api/services/**", 
                    "/api/technicians/**",
                    "/error",
                    "/actuator/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(withDefaults());
        return http.build();
    }
}
```

---

### Java Class Definitions

Below are the definitions for key Java classes used in the backend.

#### DTOs (Data Transfer Objects)

**`ServiceDTO.java`**
```java
package com.beautyplaza.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer duration; // in minutes
    private String imageUrl;
    private boolean isActive;
}
```

**`TechnicianDTO.java`**
```java
package com.beautyplaza.dto;

import lombok.Data;
import java.util.List;

@Data
public class TechnicianDTO {
    private Long id;
    private String name;
    private List<String> specialties;
    private boolean isAvailable;
}
```

**`AppointmentDTO.java`**
```java
package com.beautyplaza.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentDTO {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private Long technicianId;
    private String technicianName;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status; // e.g., "scheduled", "confirmed", "cancelled"
    private String serviceType; // e.g., "in-store" or "in-home"
    private String notes;
    private BigDecimal totalAmount;
}
```

**`ProfileDTO.java`**
```java
package com.beautyplaza.dto;

import lombok.Data;

@Data
public class ProfileDTO {
    private String id; // UUID from Auth provider
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String role; // e.g., "customer", "admin"
}
```

#### Request/Response Payloads

**`BookingRequest.java`**
```java
package com.beautyplaza.request;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    private Long serviceId;
    private Long technicianId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String serviceType;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String notes;
}
```

---

This detailed setup provides a solid foundation for local development and further feature implementation.
