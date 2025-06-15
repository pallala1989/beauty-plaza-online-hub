
# Beauty Plaza - Full Stack Booking Application

This repository contains the code for Beauty Plaza, a full-stack web application for a beauty salon. It includes a React frontend and a Spring Boot backend.

## Frontend (React + Vite)

The frontend is built with React, Vite, TypeScript, Tailwind CSS, and Shadcn UI components.

### Key Features
- Service browsing and selection
- Online appointment booking flow
- Customer authentication (Login/Register)
- User profile management (view bookings, update info)
- Admin dashboard for managing services, technicians, and settings.

## Backend (Spring Boot)

The backend is a Spring Boot application that provides a RESTful API for the frontend.

### Architecture
- **Controller Layer**: Handles HTTP requests and responses.
- **Service Layer**: Contains business logic.
- **Repository Layer**: Interacts with the database using Spring Data JPA.
- **Model/Entity Layer**: Defines the data structures.
- **DTOs**: Data Transfer Objects for clean API contracts.
- **Security**: JWT-based authentication and authorization.

### Database Schema
- `services`
- `technicians`
- `appointments`
- `users`
- `roles`
- `user_roles`
- `settings`

### API Endpoints
- `POST /api/auth/signin`
- `POST /api/auth/signup`
- `GET /api/services`
- `GET /api/technicians`
- `GET /api/appointments/slots`
- `POST /api/appointments/book`
- `GET /api/admin/settings`
- `POST /api/admin/settings`

### Java Class Definitions

Below are the definitions for key Java classes used in the backend.

#### `pom.xml` (Dependencies)
```xml
<dependencies>
    <!-- Spring Boot Starter -->
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

    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- JWT Library -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
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

#### DTOs (Data Transfer Objects)

**`AppointmentDTO.java`**
```java
package com.beautyplaza.dto;

import lombok.Data;
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
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String serviceType; // e.g., "in-salon" or "in-home"
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
}
```

**`CustomerDTO.java`**
```java
package com.beautyplaza.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
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
}
```

**`LoginRequest.java`**
```java
package com.beautyplaza.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
```

**`JwtResponse.java`**
```java
package com.beautyplaza.response;

import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.roles = roles;
    }
}
```

---

This detailed setup provides a solid foundation for local development and further feature implementation.
