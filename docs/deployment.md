
# Deployment Guide

This guide covers deploying Beauty Plaza to production environments.

## Prerequisites

- Java 17+ runtime environment
- MySQL 8.0+ database server
- Web server (Nginx recommended)
- SSL certificate for HTTPS
- Domain name and DNS configuration

## Environment Setup

### Production Configuration

Create `application-prod.properties`:
```properties
# Application
spring.application.name=beautyplaza
spring.profiles.active=prod

# Database (Production)
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:3306/${DB_NAME:beauty_plaza}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.hikari.maximum-pool-size=20

# JPA/Hibernate (Production)
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Security
spring.security.user.name=${ADMIN_USERNAME}
spring.security.user.password=${ADMIN_PASSWORD}

# CORS (Production)
spring.web.cors.allowed-origin-patterns=${FRONTEND_URL:https://yoursite.com}

# Server Configuration
server.port=${PORT:8080}
server.compression.enabled=true
server.http2.enabled=true

# SSL Configuration (if applicable)
server.ssl.enabled=${SSL_ENABLED:false}
server.ssl.key-store=${SSL_KEYSTORE_PATH:}
server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD:}

# Logging
logging.level.com.beautyplaza=INFO
logging.level.org.springframework.security=WARN
logging.file.name=logs/beautyplaza.log
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.total-size-cap=100MB
```

### Environment Variables

Create `.env` file or set system environment variables:
```bash
# Database Configuration
DB_HOST=your-db-host
DB_NAME=beauty_plaza
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

# Admin Credentials
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-password

# Application Configuration
FRONTEND_URL=https://your-domain.com
PORT=8080

# SSL Configuration (optional)
SSL_ENABLED=true
SSL_KEYSTORE_PATH=/path/to/keystore.p12
SSL_KEYSTORE_PASSWORD=your-keystore-password
```

## Backend Deployment

### Using JAR File

1. **Build the application**:
   ```bash
   mvn clean package -Pprod
   ```

2. **Deploy JAR file**:
   ```bash
   java -jar -Dspring.profiles.active=prod target/beauty-plaza-backend-1.0.0.jar
   ```

3. **Create systemd service** (Linux):
   ```bash
   sudo nano /etc/systemd/system/beautyplaza.service
   ```

   ```ini
   [Unit]
   Description=Beauty Plaza Backend
   After=network.target

   [Service]
   Type=simple
   User=beautyplaza
   WorkingDirectory=/opt/beautyplaza
   ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod beauty-plaza-backend-1.0.0.jar
   Restart=always
   RestartSec=10
   Environment="DB_HOST=localhost"
   Environment="DB_NAME=beauty_plaza"
   Environment="DB_USERNAME=beautyplaza_user"
   Environment="DB_PASSWORD=secure_password"

   [Install]
   WantedBy=multi-user.target
   ```

4. **Start the service**:
   ```bash
   sudo systemctl enable beautyplaza
   sudo systemctl start beautyplaza
   sudo systemctl status beautyplaza
   ```

### Using Docker

1. **Create Dockerfile**:
   ```dockerfile
   FROM openjdk:17-jre-slim

   # Create app directory
   WORKDIR /app

   # Copy JAR file
   COPY target/beauty-plaza-backend-1.0.0.jar app.jar

   # Expose port
   EXPOSE 8080

   # Run the application
   ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
   ```

2. **Build Docker image**:
   ```bash
   docker build -t beauty-plaza-backend .
   ```

3. **Run container**:
   ```bash
   docker run -d \
     --name beauty-plaza-backend \
     -p 8080:8080 \
     -e DB_HOST=your-db-host \
     -e DB_USERNAME=your-db-user \
     -e DB_PASSWORD=your-db-password \
     -e ADMIN_USERNAME=admin \
     -e ADMIN_PASSWORD=secure-password \
     beauty-plaza-backend
   ```

### Using Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  database:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: beauty_plaza
      MYSQL_USER: beautyplaza_user
      MYSQL_PASSWORD: secure_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  backend:
    build: .
    restart: always
    depends_on:
      - database
    environment:
      DB_HOST: database
      DB_NAME: beauty_plaza
      DB_USERNAME: beautyplaza_user
      DB_PASSWORD: secure_password
      ADMIN_USERNAME: admin
      ADMIN_PASSWORD: secure_admin_password
    ports:
      - "8080:8080"

volumes:
  mysql_data:
```

Run with:
```bash
docker-compose up -d
```

## Frontend Deployment

### Build for Production

1. **Update environment variables**:
   ```bash
   # .env.production
   VITE_API_BASE_URL=https://api.your-domain.com
   VITE_APP_NAME=Beauty Plaza
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Deploy static files**:
   Upload the `dist/` folder to your web server.

### Nginx Configuration

Create `/etc/nginx/sites-available/beautyplaza`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Frontend
    location / {
        root /var/www/beautyplaza/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/beautyplaza /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Database Setup

### Production Database

1. **Create database and user**:
   ```sql
   CREATE DATABASE beauty_plaza;
   CREATE USER 'beautyplaza_user'@'%' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON beauty_plaza.* TO 'beautyplaza_user'@'%';
   FLUSH PRIVILEGES;
   ```

2. **Run schema migrations**:
   ```bash
   mysql -u beautyplaza_user -p beauty_plaza < database-schema.sql
   mysql -u beautyplaza_user -p beauty_plaza < sample-data.sql
   ```

3. **Configure database backup**:
   ```bash
   # Create backup script
   cat > /opt/backup/backup-beautyplaza.sh << 'EOF'
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mysqldump -u beautyplaza_user -p'secure_password' beauty_plaza > /opt/backup/beautyplaza_$DATE.sql
   find /opt/backup -name "beautyplaza_*.sql" -mtime +7 -delete
   EOF

   chmod +x /opt/backup/backup-beautyplaza.sh

   # Add to crontab (daily backup at 2 AM)
   echo "0 2 * * * /opt/backup/backup-beautyplaza.sh" | crontab -
   ```

## SSL Certificate

### Using Let's Encrypt (Certbot)

1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Auto-renewal**:
   ```bash
   sudo systemctl enable certbot.timer
   sudo systemctl start certbot.timer
   ```

## Monitoring & Logging

### Application Monitoring

1. **Health check endpoint**: `GET /actuator/health`
2. **Metrics endpoint**: `GET /actuator/metrics`
3. **Log monitoring**: Use ELK stack or similar

### Log Rotation

Configure logrotate for application logs:
```bash
sudo nano /etc/logrotate.d/beautyplaza
```

```
/opt/beautyplaza/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
```

## Performance Optimization

### Backend Optimizations
- Enable JPA query optimization
- Configure connection pooling
- Enable caching where appropriate
- Optimize database indexes

### Frontend Optimizations
- Enable gzip compression
- Optimize images
- Implement CDN for static assets
- Enable browser caching

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Strong database passwords
- [ ] Regular security updates
- [ ] Firewall configuration
- [ ] Regular backups
- [ ] Monitor access logs
- [ ] Implement rate limiting
- [ ] Security headers configured
- [ ] Database access restricted
- [ ] Admin credentials secured

## Troubleshooting

### Common Issues

1. **Application won't start**:
   - Check logs: `sudo journalctl -u beautyplaza -f`
   - Verify environment variables
   - Check database connectivity

2. **Database connection issues**:
   - Verify credentials
   - Check firewall rules
   - Test connection manually

3. **Frontend routing issues**:
   - Ensure Nginx `try_files` is configured
   - Check for CORS issues
   - Verify API endpoints

### Health Checks

```bash
# Backend health
curl -f http://localhost:8080/actuator/health

# Database connection
mysql -u beautyplaza_user -p -h localhost beauty_plaza -e "SELECT 1"

# Frontend
curl -f https://your-domain.com
```
