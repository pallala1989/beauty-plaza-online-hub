
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

---

## Backend (Spring Boot with MySQL)

The backend is a Spring Boot application that provides a RESTful API for the frontend. It is designed to be secured using basic authentication for admin access and provides open endpoints for the public booking flow.

### Backend Project Structure

Here is a typical project structure for the backend application:

```
src/
└── main/
    ├── java/
    │   └── com/
    │       └── beautyplaza/
    │           ├── BeautyPlazaApplication.java
    │           ├── config/
    │           │   ├── SecurityConfig.java
    │           │   └── CorsConfig.java
    │           ├── controller/
    │           │   ├── AdminController.java
    │           │   └── PublicApiController.java
    │           ├── model/
    │           │   ├── Appointment.java
    │           │   ├── Service.java
    │           │   └── Technician.java
    │           ├── dto/
    │           │   ├── AppointmentDTO.java
    │           │   ├── ServiceDTO.java
    │           │   └── TechnicianDTO.java
    │           ├── repository/
    │           │   ├── AppointmentRepository.java
    │           │   ├── ServiceRepository.java
    │           │   └── TechnicianRepository.java
    │           ├── request/
    │           │   └── BookingRequest.java
    │           └── service/
    │               ├── BookingService.java
    │               └── SalonDataService.java
    └── resources/
        └── application.properties
```

### Backend Setup and Configuration

#### `pom.xml` (Dependencies)
You will need the following dependencies for a Spring Boot application with JPA, Web, Security, and MySQL.

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

    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Spring Boot DevTools for automatic restart -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

#### `application.properties`
This file configures your application, including database connection and CORS settings.

```properties
# Server Port
server.port=8080

# Application Name
spring.application.name=beautyplaza

# Database configuration for MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/beauty_plaza?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=Pallavi4u@

# JPA/Hibernate configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Note: The spring.security.user properties are commented out because we define users in SecurityConfig.java
# for more control (e.g., multiple users and roles).
# spring.security.user.name=user
# spring.security.user.password=user
```

---

### Full Java Class Definitions

Below are the complete definitions for all Java classes required for the backend.

#### Main Application Class
**`BeautyPlazaApplication.java`**
```java
package com.beautyplaza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BeautyPlazaApplication {
    public static void main(String[] args) {
        SpringApplication.run(BeautyPlazaApplication.class, args);
    }
}
```

#### Model (Entities)
**`Service.java`**
```java
package com.beautyplaza.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(length = 1000)
    private String description;
    private BigDecimal price;
    private Integer duration; // in minutes
    private String imageUrl;
    private boolean isActive = true;
}
```

**`Technician.java`**
```java
package com.beautyplaza.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "technicians")
public class Technician {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> specialties;
    private boolean isAvailable = true;
}
```

**`Appointment.java`**
```java
package com.beautyplaza.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long serviceId;
    private String serviceName;
    private Long technicianId;
    private String technicianName;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status; // e.g., "SCHEDULED", "CONFIRMED", "CANCELLED"
    private String serviceType; // e.g., "in-store" or "in-home"
    @Column(length = 1000)
    private String notes;
    private BigDecimal totalAmount;
}
```

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
    private Integer duration;
    private String imageUrl;
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
    private String customerName;
    private String customerEmail;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private BigDecimal totalAmount;
}
```

#### Request Payloads

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

#### Repositories

**`ServiceRepository.java`**
```java
package com.beautyplaza.repository;

import com.beautyplaza.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
}
```

**`TechnicianRepository.java`**
```java
package com.beautyplaza.repository;

import com.beautyplaza.model.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
}
```

**`AppointmentRepository.java`**
```java
package com.beautyplaza.repository;

import com.beautyplaza.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByTechnicianIdAndAppointmentDate(Long technicianId, LocalDate appointmentDate);
}
```

#### Services

**`SalonDataService.java`**
```java
package com.beautyplaza.service;

import com.beautyplaza.dto.ServiceDTO;
import com.beautyplaza.dto.TechnicianDTO;
import com.beautyplaza.model.Service;
import com.beautyplaza.model.Technician;
import com.beautyplaza.repository.ServiceRepository;
import com.beautyplaza.repository.TechnicianRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SalonDataService {

    private final ServiceRepository serviceRepository;
    private final TechnicianRepository technicianRepository;

    public List<ServiceDTO> getAllActiveServices() {
        return serviceRepository.findAll().stream()
                .filter(Service::isActive)
                .map(this::toServiceDTO)
                .collect(Collectors.toList());
    }

    public List<TechnicianDTO> getAllAvailableTechnicians() {
        return technicianRepository.findAll().stream()
                .filter(Technician::isAvailable)
                .map(this::toTechnicianDTO)
                .collect(Collectors.toList());
    }

    private ServiceDTO toServiceDTO(Service service) {
        ServiceDTO dto = new ServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setDuration(service.getDuration());
        dto.setImageUrl(service.getImageUrl());
        return dto;
    }

    private TechnicianDTO toTechnicianDTO(Technician technician) {
        TechnicianDTO dto = new TechnicianDTO();
        dto.setId(technician.getId());
        dto.setName(technician.getName());
        dto.setSpecialties(technician.getSpecialties());
        return dto;
    }
}
```

**`BookingService.java`**
```java
package com.beautyplaza.service;

import com.beautyplaza.dto.AppointmentDTO;
import com.beautyplaza.model.Appointment;
import com.beautyplaza.model.Service;
import com.beautyplaza.model.Technician;
import com.beautyplaza.repository.AppointmentRepository;
import com.beautyplaza.repository.ServiceRepository;
import com.beautyplaza.repository.TechnicianRepository;
import com.beautyplaza.request.BookingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingService {

    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;
    private final TechnicianRepository technicianRepository;

    public List<LocalTime> getAvailableSlots(Long technicianId, LocalDate date, int serviceDurationInMinutes) {
        List<LocalTime> allSlots = new ArrayList<>();
        // Example: Salon open from 9 AM to 7 PM
        LocalTime openingTime = LocalTime.of(9, 0);
        LocalTime closingTime = LocalTime.of(19, 0);

        List<Appointment> existingAppointments = appointmentRepository.findByTechnicianIdAndAppointmentDate(technicianId, date);

        LocalTime currentTimeSlot = openingTime;
        while (currentTimeSlot.isBefore(closingTime)) {
            boolean isBooked = false;
            for (Appointment appt : existingAppointments) {
                if (currentTimeSlot.equals(appt.getAppointmentTime())) {
                    isBooked = true;
                    break;
                }
            }
            if (!isBooked) {
                allSlots.add(currentTimeSlot);
            }
            currentTimeSlot = currentTimeSlot.plusMinutes(30); // Assuming 30-min slot intervals
        }
        return allSlots;
    }

    public AppointmentDTO createBooking(BookingRequest bookingRequest) {
        Service service = serviceRepository.findById(bookingRequest.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        Technician technician = technicianRepository.findById(bookingRequest.getTechnicianId())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        Appointment appointment = new Appointment();
        appointment.setServiceId(service.getId());
        appointment.setServiceName(service.getName());
        appointment.setTechnicianId(technician.getId());
        appointment.setTechnicianName(technician.getName());
        appointment.setAppointmentDate(bookingRequest.getAppointmentDate());
        appointment.setAppointmentTime(bookingRequest.getAppointmentTime());
        appointment.setCustomerName(bookingRequest.getCustomerName());
        appointment.setCustomerEmail(bookingRequest.getCustomerEmail());
        appointment.setCustomerPhone(bookingRequest.getCustomerPhone());
        appointment.setNotes(bookingRequest.getNotes());
        appointment.setServiceType(bookingRequest.getServiceType());
        appointment.setStatus("SCHEDULED");
        appointment.setTotalAmount(service.getPrice());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return toAppointmentDTO(savedAppointment);
    }
    
    private AppointmentDTO toAppointmentDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setServiceId(appointment.getServiceId());
        dto.setServiceName(appointment.getServiceName());
        dto.setTechnicianId(appointment.getTechnicianId());
        dto.setTechnicianName(appointment.getTechnicianName());
        dto.setCustomerName(appointment.getCustomerName());
        dto.setCustomerEmail(appointment.getCustomerEmail());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setStatus(appointment.getStatus());
        dto.setTotalAmount(appointment.getTotalAmount());
        return dto;
    }
}
```

#### Controllers

**`PublicApiController.java`**
```java
package com.beautyplaza.controller;

import com.beautyplaza.dto.AppointmentDTO;
import com.beautyplaza.dto.ServiceDTO;
import com.beautyplaza.dto.TechnicianDTO;
import com.beautyplaza.request.BookingRequest;
import com.beautyplaza.service.BookingService;
import com.beautyplaza.service.SalonDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicApiController {

    private final SalonDataService salonDataService;
    private final BookingService bookingService;

    @GetMapping("/services")
    public List<ServiceDTO> getServices() {
        return salonDataService.getAllActiveServices();
    }

    @GetMapping("/technicians")
    public List<TechnicianDTO> getTechnicians() {
        return salonDataService.getAllAvailableTechnicians();
    }

    @GetMapping("/appointments/slots")
    public ResponseEntity<List<LocalTime>> getAvailableSlots(
            @RequestParam Long technicianId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam int serviceDuration) {
        List<LocalTime> slots = bookingService.getAvailableSlots(technicianId, date, serviceDuration);
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/appointments/book")
    public ResponseEntity<AppointmentDTO> bookAppointment(@RequestBody BookingRequest bookingRequest) {
        AppointmentDTO newAppointment = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(newAppointment);
    }
}
```

**`AdminController.java`**
```java
package com.beautyplaza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Welcome to the Admin Dashboard!");
    }

    // Add more admin-specific endpoints here (e.g., for managing services, technicians, settings)
}
```

#### Configuration

**`SecurityConfig.java`**
```java
package com.beautyplaza.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/**").permitAll() // Public endpoints
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults()) // Use HTTP Basic authentication
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Stateless session
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("admin"))
            .roles("ADMIN")
            .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**`CorsConfig.java`**
```java
package com.beautyplaza.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOriginPatterns("http://localhost:3000", "http://localhost:5173") // Add your frontend URLs
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---
### API Endpoints Summary

- `GET /api/services`: Get all active services.
- `GET /api/technicians`: Get all available technicians.
- `GET /api/appointments/slots`: Get available appointment slots for a technician on a specific date.
- `POST /api/appointments/book`: Book a new appointment.
- `GET /api/admin/dashboard`: (Admin only) Access the admin dashboard.

This detailed setup provides a solid foundation for your Spring Boot backend. You can copy these files into your IDE to create the project.
