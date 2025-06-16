
# Authentication & Security

This document covers the authentication and security implementation for Beauty Plaza.

## Overview

Beauty Plaza uses a simplified OAuth-style authentication system with role-based access control.

## Authentication Flow

### Admin Authentication
1. User accesses admin-protected route
2. System redirects to login page
3. User enters credentials (default: admin/admin)
4. System validates credentials
5. On success, user is redirected to admin dashboard
6. Session maintains authentication state

### Customer Authentication
- Currently using session-based authentication
- Future: OAuth2 integration with Google/Facebook
- Guest booking allowed without authentication

## Security Configuration

### Spring Security Setup
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/api/services/**", "/api/technicians/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/admin", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            );
        return http.build();
    }
}
```

### CORS Configuration
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## User Roles

### Admin Role
- Full access to admin dashboard
- Can manage services, technicians, settings
- Can view and modify all appointments
- Access to analytics and reports

### Customer Role (Future)
- Can book appointments
- View booking history
- Manage profile
- Access loyalty program

### Guest Role
- Can browse services
- Can book appointments (with contact info)
- Limited access to public pages

## Default Credentials

### Development
- **Username**: `admin`
- **Password**: `admin`
- **Role**: ADMIN

### Production Setup
```properties
# Override in production
spring.security.user.name=${ADMIN_USERNAME:admin}
spring.security.user.password=${ADMIN_PASSWORD:admin}
```

## Frontend Authentication Context

### AuthContext Implementation
```typescript
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}
```

### Login Flow
1. User submits credentials via login form
2. Frontend calls authentication endpoint
3. On success, user state is updated
4. Protected routes become accessible
5. User is redirected to intended destination

### Protected Routes
```typescript
<ProtectedRoute requireAdmin>
  <AdminDashboard />
</ProtectedRoute>
```

## Security Best Practices

### Current Implementation
- CSRF protection disabled for API endpoints
- CORS configured for development
- Session-based authentication
- Role-based access control

### Production Recommendations
1. **Enable HTTPS**: All communications should use SSL/TLS
2. **Strong Passwords**: Implement password complexity requirements
3. **Rate Limiting**: Add rate limiting to prevent brute force attacks
4. **JWT Tokens**: Consider JWT for stateless authentication
5. **OAuth2 Integration**: Add Google/Facebook login
6. **Input Validation**: Validate all user inputs
7. **SQL Injection Prevention**: Use parameterized queries (already implemented with JPA)

### Environment Variables
```bash
# Production environment variables
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_password
JWT_SECRET=your_jwt_secret_key
OAUTH2_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH2_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Session Management

### Configuration
```properties
# Session timeout (30 minutes)
server.servlet.session.timeout=30m

# Session storage
spring.session.store-type=jdbc
```

### Session Security
- Secure session cookies
- HttpOnly flag enabled
- SameSite attribute set
- Session fixation protection

## API Security

### Authentication Headers
```bash
# For authenticated requests
Authorization: Bearer <token>
Content-Type: application/json
```

### Error Responses
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Access denied",
  "path": "/api/admin/settings"
}
```

## Monitoring & Logging

### Security Events
- Failed login attempts
- Unauthorized access attempts
- Admin actions
- Password changes

### Log Configuration
```properties
# Security logging
logging.level.org.springframework.security=INFO
logging.level.com.beautyplaza.security=DEBUG
```

## Future Enhancements

1. **Multi-Factor Authentication (MFA)**
2. **OAuth2 Provider Integration**
3. **API Key Authentication for partners**
4. **Advanced Role Management**
5. **Audit Trail for admin actions**
6. **Password Reset functionality**
7. **Account lockout after failed attempts**
