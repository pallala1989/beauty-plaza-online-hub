
# Backend Setup & Configuration

This guide covers setting up the Spring Boot backend for Beauty Plaza.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Project Structure

```
src/main/java/com/beautyplaza/
├── config/              # Configuration classes
├── controller/          # REST controllers
├── dto/                # Data Transfer Objects
├── entity/             # JPA entities
├── repository/         # Data repositories
├── service/            # Business logic
├── request/            # Request payload classes
└── BeautyPlazaApplication.java
```

## Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.beautyplaza</groupId>
    <artifactId>beauty-plaza-backend</artifactId>
    <version>1.0.0</version>
    <name>beauty-plaza-backend</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
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
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Utilities -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
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
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## Configuration Files

### application.properties
```properties
# Application
spring.application.name=beautyplaza

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/beauty_plaza
spring.datasource.username=root
spring.datasource.password=Pallavi4u@
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Default Admin Credentials
spring.security.user.name=admin
spring.security.user.password=admin

# CORS Configuration
spring.web.cors.allowed-origin-patterns=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# Server Configuration
server.port=8080
server.servlet.context-path=/

# Logging
logging.level.com.beautyplaza=DEBUG
logging.level.org.springframework.security=DEBUG
```

## Running the Application

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd beauty-plaza-backend
   ```

2. **Database Setup**:
   - Create MySQL database: `CREATE DATABASE beauty_plaza;`
   - Run the queries from [Database Documentation](./database.md)

3. **Build and Run**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Verify Setup**:
   - Backend: http://localhost:8080
   - API Health: http://localhost:8080/api/services
   - Admin Login: Use `admin`/`admin` credentials

## Environment Variables (Optional)

For production deployment, you can use environment variables:

```bash
export DB_URL=jdbc:mysql://localhost:3306/beauty_plaza
export DB_USERNAME=root
export DB_PASSWORD=your_password
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=secure_password
```

Then update application.properties:
```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.security.user.name=${ADMIN_USERNAME}
spring.security.user.password=${ADMIN_PASSWORD}
```
