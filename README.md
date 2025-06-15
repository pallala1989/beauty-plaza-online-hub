
# Beauty Plaza - Full Stack Beauty Parlor Application

This is a modern beauty parlor booking system built with React frontend and Spring Boot backend.

## Architecture Overview

- **Frontend**: React + TypeScript + Tailwind CSS + Supabase (for auth only)
- **Backend**: Spring Boot + MySQL + JWT Authentication
- **Database**: MySQL for all business data

## Quick Start

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

---

## Spring Boot Backend Implementation

### 1. Project Structure
```
backend/
├── src/main/java/com/beautyplaza/
│   ├── BeautyPlazaApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtConfig.java
│   │   └── CorsConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ServiceController.java
│   │   ├── TechnicianController.java
│   │   ├── AppointmentController.java
│   │   ├── ProfileController.java
│   │   ├── LoyaltyController.java
│   │   ├── ReferralController.java
│   │   ├── GiftCardController.java
│   │   ├── PromotionController.java
│   │   └── SettingsController.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Profile.java
│   │   ├── Service.java
│   │   ├── Technician.java
│   │   ├── Appointment.java
│   │   ├── LoyaltyPoints.java
│   │   ├── Referral.java
│   │   ├── GiftCard.java
│   │   ├── Promotion.java
│   │   └── Settings.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ProfileRepository.java
│   │   ├── ServiceRepository.java
│   │   ├── TechnicianRepository.java
│   │   ├── AppointmentRepository.java
│   │   ├── LoyaltyPointsRepository.java
│   │   ├── ReferralRepository.java
│   │   ├── GiftCardRepository.java
│   │   ├── PromotionRepository.java
│   │   └── SettingsRepository.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ServiceService.java
│   │   ├── TechnicianService.java
│   │   ├── AppointmentService.java
│   │   ├── ProfileService.java
│   │   ├── LoyaltyService.java
│   │   ├── ReferralService.java
│   │   ├── GiftCardService.java
│   │   ├── PromotionService.java
│   │   └── SettingsService.java
│   ├── dto/
│   │   ├── request/
│   │   └── response/
│   └── security/
│       ├── JwtAuthenticationEntryPoint.java
│       ├── JwtAuthenticationFilter.java
│       └── JwtTokenProvider.java
└── src/main/resources/
    ├── application.yml
    └── data.sql
```

### 2. Dependencies (pom.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.beautyplaza</groupId>
    <artifactId>beauty-plaza-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>beauty-plaza-backend</name>
    <description>Beauty Plaza Backend API</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
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
            <version>8.0.33</version>
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
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3. Application Configuration (application.yml)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/beauty_plaza?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect
        
  jackson:
    time-zone: UTC
    date-format: yyyy-MM-dd HH:mm:ss

jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400000

logging:
  level:
    com.beautyplaza: DEBUG
    org.springframework.security: DEBUG
```

### 4. Main Application Class
```java
// src/main/java/com/beautyplaza/BeautyPlazaApplication.java
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

### 5. Entity Models

#### User.java
```java
// src/main/java/com/beautyplaza/model/User.java
package com.beautyplaza.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.CUSTOMER;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private LoyaltyPoints loyaltyPoints;

    // Constructors
    public User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    public LoyaltyPoints getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(LoyaltyPoints loyaltyPoints) { this.loyaltyPoints = loyaltyPoints; }

    public enum UserRole {
        CUSTOMER, TECHNICIAN, ADMIN
    }
}
```

#### Profile.java
```java
// src/main/java/com/beautyplaza/model/Profile.java
package com.beautyplaza.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name")
    private String fullName;

    private String phone;
    private String address;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Profile() {}

    public Profile(User user, String fullName) {
        this.user = user;
        this.fullName = fullName;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

#### Service.java
```java
// src/main/java/com/beautyplaza/model/Service.java
package com.beautyplaza.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    private String name;

    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private Integer duration; // in minutes

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Service() {}

    public Service(String name, String description, BigDecimal price, Integer duration) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

#### Technician.java
```java
// src/main/java/com/beautyplaza/model/Technician.java
package com.beautyplaza.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "technicians")
public class Technician {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    @ElementCollection
    @CollectionTable(name = "technician_specialties", joinColumns = @JoinColumn(name = "technician_id"))
    @Column(name = "specialty")
    private List<String> specialties;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Technician() {}

    public Technician(String name, List<String> specialties) {
        this.name = name;
        this.specialties = specialties;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getSpecialties() { return specialties; }
    public void setSpecialties(List<String> specialties) { this.specialties = specialties; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

#### Appointment.java
```java
// src/main/java/com/beautyplaza/model/Appointment.java
package com.beautyplaza.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne
    @JoinColumn(name = "technician_id")
    private Technician technician;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "appointment_time")
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "service_type")
    private String serviceType = "in-store"; // "in-store" or "in-home"

    private String notes;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "otp_verified")
    private Boolean otpVerified = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Appointment() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }

    public Technician getTechnician() { return technician; }
    public void setTechnician(Technician technician) { this.technician = technician; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Boolean getOtpVerified() { return otpVerified; }
    public void setOtpVerified(Boolean otpVerified) { this.otpVerified = otpVerified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public enum AppointmentStatus {
        SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
    }
}
```

#### LoyaltyPoints.java
```java
// src/main/java/com/beautyplaza/model/LoyaltyPoints.java
package com.beautyplaza.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_points")
public class LoyaltyPoints {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer points = 0;

    @Column(name = "total_earned")
    private Integer totalEarned = 0;

    @Column(name = "total_redeemed")
    private Integer totalRedeemed = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public LoyaltyPoints() {}

    public LoyaltyPoints(User user) {
        this.user = user;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public Integer getTotalEarned() { return totalEarned; }
    public void setTotalEarned(Integer totalEarned) { this.totalEarned = totalEarned; }

    public Integer getTotalRedeemed() { return totalRedeemed; }
    public void setTotalRedeemed(Integer totalRedeemed) { this.totalRedeemed = totalRedeemed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
```

### 6. Security Configuration

#### JwtTokenProvider.java
```java
// src/main/java/com/beautyplaza/security/JwtTokenProvider.java
package com.beautyplaza.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

#### JwtAuthenticationFilter.java
```java
// src/main/java/com/beautyplaza/security/JwtAuthenticationFilter.java
package com.beautyplaza.security;

import com.beautyplaza.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);

                UserDetails userDetails = authService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

#### SecurityConfig.java
```java
// src/main/java/com/beautyplaza/config/SecurityConfig.java
package com.beautyplaza.config;

import com.beautyplaza.security.JwtAuthenticationEntryPoint;
import com.beautyplaza.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/services/**").permitAll()
                .requestMatchers("/api/technicians/**").permitAll()
                .requestMatchers("/api/promotions/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### 7. Controllers

#### AuthController.java
```java
// src/main/java/com/beautyplaza/controller/AuthController.java
package com.beautyplaza.controller;

import com.beautyplaza.dto.request.LoginRequest;
import com.beautyplaza.dto.request.SignUpRequest;
import com.beautyplaza.dto.response.JwtAuthenticationResponse;
import com.beautyplaza.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        JwtAuthenticationResponse response = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }
}
```

#### ServiceController.java
```java
// src/main/java/com/beautyplaza/controller/ServiceController.java
package com.beautyplaza.controller;

import com.beautyplaza.model.Service;
import com.beautyplaza.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceService.getAllActiveServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable String id) {
        Service service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }
}
```

#### TechnicianController.java
```java
// src/main/java/com/beautyplaza/controller/TechnicianController.java
package com.beautyplaza.controller;

import com.beautyplaza.model.Technician;
import com.beautyplaza.service.TechnicianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
@CrossOrigin(origins = "http://localhost:5173")
public class TechnicianController {

    @Autowired
    private TechnicianService technicianService;

    @GetMapping
    public ResponseEntity<List<Technician>> getAllTechnicians() {
        List<Technician> technicians = technicianService.getAllAvailableTechnicians();
        return ResponseEntity.ok(technicians);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Technician> getTechnicianById(@PathVariable String id) {
        Technician technician = technicianService.getTechnicianById(id);
        return ResponseEntity.ok(technician);
    }
}
```

#### AppointmentController.java
```java
// src/main/java/com/beautyplaza/controller/AppointmentController.java
package com.beautyplaza.controller;

import com.beautyplaza.dto.request.AppointmentRequest;
import com.beautyplaza.dto.response.AppointmentResponse;
import com.beautyplaza.model.Appointment;
import com.beautyplaza.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        AppointmentResponse response = appointmentService.createAppointment(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        List<AppointmentResponse> appointments = appointmentService.getUserAppointments(authentication.getName());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/booked-slots")
    public ResponseEntity<List<String>> getBookedSlots(
            @RequestParam String technicianId,
            @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        List<String> bookedSlots = appointmentService.getBookedSlots(technicianId, appointmentDate);
        return ResponseEntity.ok(bookedSlots);
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<AppointmentResponse> rescheduleAppointment(
            @PathVariable String id,
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        AppointmentResponse response = appointmentService.rescheduleAppointment(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable String id, Authentication authentication) {
        appointmentService.cancelAppointment(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
```

### 8. Services

#### AuthService.java
```java
// src/main/java/com/beautyplaza/service/AuthService.java
package com.beautyplaza.service;

import com.beautyplaza.dto.request.LoginRequest;
import com.beautyplaza.dto.request.SignUpRequest;
import com.beautyplaza.dto.response.JwtAuthenticationResponse;
import com.beautyplaza.model.LoyaltyPoints;
import com.beautyplaza.model.Profile;
import com.beautyplaza.model.User;
import com.beautyplaza.repository.LoyaltyPointsRepository;
import com.beautyplaza.repository.ProfileRepository;
import com.beautyplaza.repository.UserRepository;
import com.beautyplaza.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private LoyaltyPointsRepository loyaltyPointsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user;
    }

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = (User) authentication.getPrincipal();
        return new JwtAuthenticationResponse(jwt, user.getId(), user.getEmail(), user.getRole().name());
    }

    @Transactional
    public JwtAuthenticationResponse registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Create new user
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(User.UserRole.CUSTOMER);

        User savedUser = userRepository.save(user);

        // Create profile
        Profile profile = new Profile();
        profile.setUser(savedUser);
        profile.setFullName(signUpRequest.getFullName());
        profileRepository.save(profile);

        // Create loyalty points
        LoyaltyPoints loyaltyPoints = new LoyaltyPoints();
        loyaltyPoints.setUser(savedUser);
        loyaltyPointsRepository.save(loyaltyPoints);

        // Authenticate and return JWT
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signUpRequest.getEmail(),
                        signUpRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new JwtAuthenticationResponse(jwt, savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());
    }
}
```

#### AppointmentService.java
```java
// src/main/java/com/beautyplaza/service/AppointmentService.java
package com.beautyplaza.service;

import com.beautyplaza.dto.request.AppointmentRequest;
import com.beautyplaza.dto.response.AppointmentResponse;
import com.beautyplaza.model.Appointment;
import com.beautyplaza.model.Service;
import com.beautyplaza.model.Technician;
import com.beautyplaza.model.User;
import com.beautyplaza.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request, String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.beautyplaza.model.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Technician technician = technicianRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        // Check if slot is available
        if (isSlotBooked(request.getTechnicianId(), request.getAppointmentDate(), request.getAppointmentTime())) {
            throw new RuntimeException("Time slot is already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setService(service);
        appointment.setTechnician(technician);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setServiceType(request.getServiceType());
        appointment.setNotes(request.getNotes());
        appointment.setCustomerEmail(customer.getEmail());
        appointment.setCustomerPhone(request.getCustomerPhone());
        appointment.setTotalAmount(service.getPrice());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return mapToResponse(savedAppointment);
    }

    public List<AppointmentResponse> getUserAppointments(String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Appointment> appointments = appointmentRepository.findByCustomerOrderByAppointmentDateDesc(customer);
        return appointments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<String> getBookedSlots(String technicianId, LocalDate date) {
        List<Appointment> appointments = appointmentRepository
                .findByTechnicianIdAndAppointmentDateAndStatusIn(
                        technicianId, 
                        date, 
                        List.of(Appointment.AppointmentStatus.SCHEDULED, Appointment.AppointmentStatus.CONFIRMED)
                );

        return appointments.stream()
                .map(appointment -> appointment.getAppointmentTime().toString())
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse rescheduleAppointment(String appointmentId, AppointmentRequest request, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!appointment.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Unauthorized to modify this appointment");
        }

        // Check if new slot is available
        if (isSlotBooked(request.getTechnicianId(), request.getAppointmentDate(), request.getAppointmentTime())) {
            throw new RuntimeException("New time slot is already booked");
        }

        Technician technician = technicianRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        appointment.setTechnician(technician);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment);
    }

    @Transactional
    public void cancelAppointment(String appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!appointment.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException("Unauthorized to cancel this appointment");
        }

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    private boolean isSlotBooked(String technicianId, LocalDate date, LocalTime time) {
        return appointmentRepository.existsByTechnicianIdAndAppointmentDateAndAppointmentTimeAndStatusIn(
                technicianId, 
                date, 
                time,
                List.of(Appointment.AppointmentStatus.SCHEDULED, Appointment.AppointmentStatus.CONFIRMED)
        );
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setAppointmentDate(appointment.getAppointmentDate());
        response.setAppointmentTime(appointment.getAppointmentTime());
        response.setStatus(appointment.getStatus().name());
        response.setServiceName(appointment.getService().getName());
        response.setTechnicianName(appointment.getTechnician().getName());
        response.setTotalAmount(appointment.getTotalAmount());
        response.setServiceType(appointment.getServiceType());
        response.setNotes(appointment.getNotes());
        return response;
    }
}
```

### 9. DTOs

#### LoginRequest.java
```java
// src/main/java/com/beautyplaza/dto/request/LoginRequest.java
package com.beautyplaza.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
```

#### SignUpRequest.java
```java
// src/main/java/com/beautyplaza/dto/request/SignUpRequest.java
package com.beautyplaza.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SignUpRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
```

#### AppointmentRequest.java
```java
// src/main/java/com/beautyplaza/dto/request/AppointmentRequest.java
package com.beautyplaza.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentRequest {
    @NotBlank
    private String serviceId;

    @NotBlank
    private String technicianId;

    @NotNull
    private LocalDate appointmentDate;

    @NotNull
    private LocalTime appointmentTime;

    private String serviceType = "in-store";
    private String notes;
    private String customerPhone;

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getTechnicianId() { return technicianId; }
    public void setTechnicianId(String technicianId) { this.technicianId = technicianId; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
}
```

#### JwtAuthenticationResponse.java
```java
// src/main/java/com/beautyplaza/dto/response/JwtAuthenticationResponse.java
package com.beautyplaza.dto.response;

public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String userId;
    private String email;
    private String role;

    public JwtAuthenticationResponse(String accessToken, String userId, String email, String role) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
```

#### AppointmentResponse.java
```java
// src/main/java/com/beautyplaza/dto/response/AppointmentResponse.java
package com.beautyplaza.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponse {
    private String id;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String serviceName;
    private String technicianName;
    private BigDecimal totalAmount;
    private String serviceType;
    private String notes;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
```

### 10. Sample Data (data.sql)
```sql
-- src/main/resources/data.sql
INSERT INTO services (id, name, description, price, duration, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Facial Treatment', 'Deep cleansing facial with moisturizing', 75.00, 60, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Hair Cut & Style', 'Professional hair cutting and styling', 50.00, 45, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Manicure', 'Complete nail care and polish', 35.00, 30, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Pedicure', 'Foot care and nail treatment', 45.00, 45, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Makeup Application', 'Professional makeup for special events', 80.00, 60, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Eyebrow Threading', 'Precise eyebrow shaping', 25.00, 20, true, NOW(), NOW());

INSERT INTO technicians (id, name, is_available, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Emily Chen', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Maria Rodriguez', true, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Ashley Kim', true, NOW(), NOW());

INSERT INTO technician_specialties (technician_id, specialty) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Facial Treatment'),
('660e8400-e29b-41d4-a716-446655440001', 'Makeup Application'),
('660e8400-e29b-41d4-a716-446655440002', 'Hair Cut & Style'),
('660e8400-e29b-41d4-a716-446655440003', 'Manicure'),
('660e8400-e29b-41d4-a716-446655440003', 'Pedicure'),
('660e8400-e29b-41d4-a716-446655440003', 'Eyebrow Threading'),
('660e8400-e29b-41d4-a716-446655440004', 'Facial Treatment'),
('660e8400-e29b-41d4-a716-446655440004', 'Makeup Application'),
('660e8400-e29b-41d4-a716-446655440004', 'Eyebrow Threading');
```

---

## Frontend UI Modifications

### 1. Create API Service Layer

#### src/services/api.ts
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:8080/api';

interface AuthResponse {
  accessToken: string;
  userId: string;
  email: string;
  role: string;
}

interface ApiError {
  message: string;
  status: number;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText || 'Something went wrong',
        status: response.status,
      };
      throw error;
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async register(fullName: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ fullName, email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  // Services endpoints
  async getServices(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // Technicians endpoints
  async getTechnicians(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/technicians`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // Appointments endpoints
  async createAppointment(appointmentData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    return this.handleResponse<any>(response);
  }

  async getMyAppointments(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getBookedSlots(technicianId: string, date: string): Promise<string[]> {
    const response = await fetch(
      `${API_BASE_URL}/appointments/booked-slots?technicianId=${technicianId}&date=${date}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<string[]>(response);
  }

  async rescheduleAppointment(appointmentId: string, appointmentData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    return this.handleResponse<any>(response);
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to cancel appointment');
    }
  }
}

export const apiService = new ApiService();
export type { AuthResponse, ApiError };
```

### 2. Update Auth Context

#### src/contexts/AuthContext.tsx
```typescript
// src/contexts/AuthContext.tsx - UPDATE THESE PARTS:

// Replace Supabase imports with API service
import { apiService, type AuthResponse } from '@/services/api';

// Update login function
const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const response: AuthResponse = await apiService.login(email, password);
    
    // Store token and user data
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify({
      id: response.userId,
      email: response.email,
      role: response.role
    }));
    
    setUser({
      id: response.userId,
      email: response.email,
    });
    
    setProfile({
      role: response.role as 'admin' | 'customer' | 'technician'
    });
    
    return { user: { id: response.userId, email: response.email }, error: null };
  } catch (error: any) {
    setError(error.message);
    return { user: null, error: error.message };
  } finally {
    setIsLoading(false);
  }
};

// Update register function
const register = async (email: string, password: string, fullName: string) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const response: AuthResponse = await apiService.register(fullName, email, password);
    
    // Store token and user data
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify({
      id: response.userId,
      email: response.email,
      role: response.role
    }));
    
    setUser({
      id: response.userId,
      email: response.email,
    });
    
    setProfile({
      role: response.role as 'admin' | 'customer' | 'technician'
    });
    
    return { user: { id: response.userId, email: response.email }, error: null };
  } catch (error: any) {
    setError(error.message);
    return { user: null, error: error.message };
  } finally {
    setIsLoading(false);
  }
};

// Update logout function
const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
  setProfile(null);
};

// Update useEffect for checking existing session
useEffect(() => {
  const checkUser = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({ id: parsedUser.id, email: parsedUser.email });
        setProfile({ role: parsedUser.role });
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  };
  
  checkUser();
}, []);
```

### 3. Update Booking Data Hook

#### src/hooks/useBookingData.ts
```typescript
// src/hooks/useBookingData.ts - REPLACE WITH:

import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { format } from "date-fns";

export const useBookingData = () => {
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const fetchServices = async () => {
    try {
      console.log('Fetching services from Spring Boot API...');
      const data = await apiService.getServices();
      console.log('Services fetched successfully:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      console.log('Fetching technicians from Spring Boot API...');
      const data = await apiService.getTechnicians();
      console.log('Technicians fetched successfully:', data);
      setTechnicians(data || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setTechnicians([]);
    }
  };

  const fetchBookedSlots = async (selectedDate: Date, selectedTechnician: string) => {
    if (!selectedDate || !selectedTechnician) {
      console.log('fetchBookedSlots: Missing date or technician', { selectedDate, selectedTechnician });
      setBookedSlots([]);
      return;
    }

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('Fetching booked slots for:', { 
        selectedDate: formattedDate, 
        selectedTechnician 
      });
      
      const bookedTimes = await apiService.getBookedSlots(selectedTechnician, formattedDate);
      console.log('Booked slots found for technician', selectedTechnician, 'on', formattedDate, ':', bookedTimes);
      setBookedSlots(bookedTimes || []);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  const refreshBookedSlots = async (selectedDate?: Date, selectedTechnician?: string) => {
    if (selectedDate && selectedTechnician) {
      console.log('Force refreshing booked slots...');
      await fetchBookedSlots(selectedDate, selectedTechnician);
    }
  };

  useEffect(() => {
    console.log('useBookingData: Initial fetch triggered');
    fetchServices();
    fetchTechnicians();
  }, []);

  const clearBookedSlots = () => {
    setBookedSlots([]);
  };

  return {
    services,
    technicians,
    bookedSlots,
    fetchBookedSlots,
    clearBookedSlots,
    refreshBookedSlots
  };
};
```

### 4. Update Booking Actions Hook

#### src/hooks/booking/useBookingActions.ts
```typescript
// src/hooks/booking/useBookingActions.ts - REPLACE createAppointment function:

import { apiService } from '@/services/api';

// Inside useBookingActions hook, replace createAppointment:
const createAppointment = async (appointmentData: any) => {
  try {
    setIsSubmitting(true);
    console.log('Creating appointment with Spring Boot API:', appointmentData);

    const response = await apiService.createAppointment({
      serviceId: appointmentData.service_id,
      technicianId: appointmentData.technician_id,
      appointmentDate: appointmentData.appointment_date,
      appointmentTime: appointmentData.appointment_time,
      serviceType: appointmentData.service_type || 'in-store',
      notes: appointmentData.notes,
      customerPhone: appointmentData.customer_phone
    });

    console.log('Appointment created successfully:', response);
    
    toast({
      title: "Appointment Booked!",
      description: "Your appointment has been successfully scheduled.",
    });

    return { data: response, error: null };
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    const errorMessage = error.message || 'Failed to create appointment';
    
    toast({
      title: "Booking Failed",
      description: errorMessage,
      variant: "destructive",
    });

    return { data: null, error: errorMessage };
  } finally {
    setIsSubmitting(false);
  }
};
```

### 5. Update Appointments Hook

#### src/hooks/useAppointments.ts
```typescript
// src/hooks/useAppointments.ts - REPLACE WITH:

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';

interface AppointmentWithDetails {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  totalAmount: number;
  serviceType: string;
  notes?: string;
  serviceName: string;
  technicianName: string;
}

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching appointments for user:', user.id);
      
      const data = await apiService.getMyAppointments();
      console.log('Fetched appointments:', data);
      
      const transformedData = data?.map(appointment => ({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        totalAmount: appointment.totalAmount || 0,
        serviceType: appointment.serviceType || 'in-store',
        notes: appointment.notes,
        serviceName: appointment.serviceName || 'Unknown Service',
        technicianName: appointment.technicianName || 'Unknown Technician'
      })) || [];

      setAppointments(transformedData);
    } catch (error: any) {
      console.error('Error in fetchAppointments:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments
  };
};
```

## Integration Steps

### 1. Backend Setup
1. Create a new Spring Boot project
2. Copy all the backend code files
3. Update `application.yml` with your MySQL credentials
4. Run `./mvnw spring-boot:run`

### 2. Frontend Changes
1. Install axios if needed: `npm install axios`
2. Replace the specified files with the new API integration code
3. Update environment variables if needed
4. Test the integration

### 3. Database Setup
1. Create MySQL database: `beauty_plaza`
2. Spring Boot will auto-create tables
3. Sample data will be inserted automatically

### 4. Testing
1. Start both applications
2. Test registration/login
3. Test appointment booking
4. Verify data persistence in MySQL

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/beauty_plaza
    username: your_username
    password: your_password
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Service Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/{id}` - Get service by ID

### Technician Endpoints
- `GET /api/technicians` - Get all technicians
- `GET /api/technicians/{id}` - Get technician by ID

### Appointment Endpoints
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `GET /api/appointments/booked-slots` - Get booked slots
- `PUT /api/appointments/{id}/reschedule` - Reschedule appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

This integration replaces Supabase with Spring Boot + MySQL while maintaining all existing functionality.
