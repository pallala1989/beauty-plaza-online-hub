# Beauty Plaza API Specification

This document provides the complete API specification for the Beauty Plaza Spring Boot backend that aligns with the current React frontend implementation.

## Base Configuration

```
Base URL: http://localhost:8080
API Prefix: /api
```

## Authentication

The system supports the following admin bypass credentials for testing:
- `admin@beautyplaza.com` / `admin123`
- `test@admin.com` / `admin`
- `admin` / `admin`

## Core Entities

### Service Entity
```json
{
  "id": "number",
  "name": "string",
  "description": "string", 
  "price": "number",
  "duration": "number (minutes)",
  "imageUrl": "string",
  "isActive": "boolean"
}
```

### Technician Entity
```json
{
  "id": "string",
  "name": "string",
  "specialties": "string[]",
  "is_available": "boolean",
  "imageUrl": "string"
}
```

### Appointment Entity
```json
{
  "id": "number",
  "customerId": "string",
  "serviceId": "string", 
  "technicianId": "string",
  "appointmentDate": "string (YYYY-MM-DD)",
  "appointmentTime": "string (HH:mm)",
  "serviceType": "string (in-store|in-home)",
  "status": "string (scheduled|confirmed|completed|cancelled)",
  "notes": "string",
  "customerPhone": "string",
  "customerEmail": "string", 
  "totalAmount": "number",
  "loyaltyPointsUsed": "number",
  "loyaltyDiscount": "number",
  "otpVerified": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Settings Entity
```json
{
  "servicePrices": {
    "facial": 75,
    "haircut": 50,
    "manicure": 35,
    "pedicure": 45
  },
  "referralAmounts": {
    "referrerCredit": 10,
    "referredDiscount": 10
  },
  "loyaltySettings": {
    "pointsPerDollar": 10,
    "minRedemption": 100,
    "redemptionRate": 10
  },
  "loyaltyTiers": {
    "bronze": 0,
    "silver": 500,
    "gold": 1000,
    "platinum": 2000
  },
  "inHomeFee": 25,
  "contactPhone": "string",
  "contactEmail": "string",
  "contactAddressLine1": "string",
  "contactAddressLine2": "string",
  "navigationSettings": {
    "showPromotions": true,
    "showLoyalty": true,
    "showGiftCards": true,
    "showReferFriend": true
  },
  "businessHours": {
    "monday": {"open": "09:00", "close": "18:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "18:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "18:00", "closed": false},
    "thursday": {"open": "09:00", "close": "18:00", "closed": false},
    "friday": {"open": "09:00", "close": "18:00", "closed": false},
    "saturday": {"open": "10:00", "close": "16:00", "closed": false},
    "sunday": {"open": "10:00", "close": "16:00", "closed": true}
  },
  "bookingSettings": {
    "leadTimeHours": 24,
    "maxAdvanceBookingDays": 60,
    "allowWeekendBooking": true
  },
  "cancelationPolicy": {
    "allowCancelation": true,
    "cancelationLeadTimeHours": 24,
    "refundPolicy": "full"
  },
  "paymentSettings": {
    "acceptCreditCards": true,
    "acceptPaypal": true,
    "acceptApplePay": true,
    "acceptCash": true,
    "requireDepositPercentage": 25
  },
  "notificationSettings": {
    "emailConfirmations": true,
    "smsReminders": true,
    "emailReminders": true,
    "reminderHours": 24
  }
}
```

## API Endpoints

### 1. Health Check
```
GET /api/health
Response: { "status": "UP", "timestamp": "2024-01-01T00:00:00Z" }
```

### 2. Services Management

#### Get All Services
```
GET /api/services
Response: Service[]
```

#### Get Service by ID  
```
GET /api/services/{id}
Response: Service
```

#### Create Service (Admin)
```
POST /api/admin/services
Request Body: Service (without id)
Response: Service
```

#### Update Service (Admin)
```
PUT /api/admin/services/{id} 
Request Body: Service
Response: Service
```

#### Delete Service (Admin)
```
DELETE /api/admin/services/{id}
Response: 204 No Content
```

### 3. Technicians Management

#### Get All Available Technicians
```
GET /api/technicians
Response: Technician[]
```

#### Get Technician by ID
```
GET /api/technicians/{id}
Response: Technician  
```

#### Create Technician (Admin)
```
POST /api/admin/technicians
Request Body: Technician (without id)
Response: Technician
```

#### Update Technician (Admin) 
```
PUT /api/admin/technicians/{id}
Request Body: Technician
Response: Technician
```

#### Delete Technician (Admin)
```
DELETE /api/admin/technicians/{id}
Response: 204 No Content
```

### 4. Appointments Management

#### Get Available Time Slots
```
GET /api/appointments/slots?technicianId={id}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}
Response: {
  "bookedSlots": {
    "2024-01-15": ["10:00", "14:00", "16:30"],
    "2024-01-16": ["09:00", "11:00"]
  }
}
```

#### Book Appointment
```
POST /api/appointments
Request Body: {
  "customerId": "string",
  "serviceId": "string",
  "technicianId": "string", 
  "appointmentDate": "YYYY-MM-DD",
  "appointmentTime": "HH:mm",
  "serviceType": "in-store|in-home",
  "notes": "string",
  "customerPhone": "string",
  "customerEmail": "string",
  "totalAmount": "number",
  "loyaltyPointsUsed": "number",
  "loyaltyDiscount": "number",
  "status": "scheduled",
  "otpVerified": "boolean"
}
Response: Appointment
```

#### Get User Appointments
```
GET /api/appointments/user/{userId}
Response: Appointment[]
```

#### Get All Appointments (Admin)
```
GET /api/admin/appointments?date={YYYY-MM-DD}&status={status}&technicianId={id}
Response: Appointment[]
```

#### Update Appointment Status (Admin)
```
PUT /api/admin/appointments/{id}/status
Request Body: {
  "status": "confirmed|completed|cancelled",
  "notes": "string"
}
Response: Appointment
```

#### Cancel Appointment
```
PUT /api/appointments/{id}/cancel
Request Body: {
  "reason": "string"
}
Response: Appointment
```

### 5. Loyalty Points Management

#### Redeem Points
```
POST /api/loyalty/redeem
Request Body: {
  "userId": "string",
  "points": "number",
  "redemptionMethod": "gift_card|bank_credit",
  "dollarValue": "number",
  "bankAccount": "string (optional)",
  "routingNumber": "string (optional)"
}
Response: {
  "success": true,
  "transactionId": "string",
  "remainingPoints": "number",
  "redemptionValue": "number"
}
```

#### Get User Points Balance
```
GET /api/loyalty/balance/{userId}
Response: {
  "userId": "string",
  "totalPoints": "number",
  "availablePoints": "number",
  "pendingPoints": "number",
  "tierStatus": "bronze|silver|gold|platinum"
}
```

#### Get Points History
```
GET /api/loyalty/history/{userId}
Response: [
  {
    "transactionId": "string",
    "type": "earned|redeemed",
    "points": "number",
    "description": "string",
    "timestamp": "timestamp"
  }
]
```

### 6. Settings Management (Admin)

#### Get All Settings
```
GET /api/admin/settings
Response: Settings (complete settings object)
```

#### Update Setting
```
POST /api/admin/settings/{key}
Request Body: {
  "value": "any"
}
Response: { "key": "string", "value": "any" }
```

#### Update Business Hours
```
POST /api/admin/settings/business-hours
Request Body: {
  "monday": {"open": "09:00", "close": "18:00", "closed": false},
  "tuesday": {"open": "09:00", "close": "18:00", "closed": false},
  // ... other days
}
Response: { "success": true }
```

#### Update Navigation Settings
```
POST /api/admin/settings/navigation
Request Body: {
  "showPromotions": true,
  "showLoyalty": true,
  "showGiftCards": true,
  "showReferFriend": true
}
Response: { "success": true }
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request", 
  "message": "Validation failed",
  "path": "/api/appointments"
}
```

## Status Codes

- `200` - Success
- `201` - Created  
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema Recommendations

### services table
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

### technicians table  
```sql
CREATE TABLE technicians (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialties JSON,
  is_available BOOLEAN DEFAULT TRUE,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### appointments table
```sql
CREATE TABLE appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id VARCHAR(255) NOT NULL,
  service_id BIGINT NOT NULL,
  technician_id VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type ENUM('in-store', 'in-home') NOT NULL,
  status ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  total_amount DECIMAL(10,2),
  loyalty_points_used INTEGER DEFAULT 0,
  loyalty_discount DECIMAL(10,2) DEFAULT 0.00,
  otp_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (technician_id) REFERENCES technicians(id)
);
```

### loyalty_points table
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
  FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);
```

### settings table
```sql
CREATE TABLE settings (
  setting_key VARCHAR(255) PRIMARY KEY,
  setting_value JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## CORS Configuration

Make sure your Spring Boot application includes CORS configuration:

```java
@CrossOrigin(origins = {"http://localhost:3000", "https://preview--beauty-plaza-online-hub.lovable.app"})
```

## Sample Data

### Services
```json
[
  {
    "id": 1,
    "name": "Classic Facial",
    "description": "Deep cleansing facial with extractions",
    "price": 75.00,
    "duration": 60,
    "imageUrl": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
    "isActive": true
  },
  {
    "id": 2, 
    "name": "Anti-Aging Treatment",
    "description": "Advanced anti-aging facial with collagen boost",
    "price": 120.00,
    "duration": 90,
    "imageUrl": "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae",
    "isActive": true
  }
]
```

### Technicians
```json
[
  {
    "id": "1",
    "name": "Sarah Johnson", 
    "specialties": ["Facial", "Anti-Aging"],
    "is_available": true,
    "imageUrl": "https://images.unsplash.com/photo-1594824092-b247a3b34ffc"
  },
  {
    "id": "2",
    "name": "Emily Davis",
    "specialties": ["Skincare", "Facial"],
    "is_available": true, 
    "imageUrl": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
  }
]
```

## New Features Added

### Navigation Control
- Admin can toggle visibility of Promotions, Loyalty, Gift Cards, and Refer Friend menu items
- Changes reflect immediately in the navigation bar

### Enhanced Booking Flow
- Auto-selection of today's date when reaching date/time step
- Auto-selection of first available time slot for selected date
- Service images are properly loaded and cached locally
- Loyalty points integration in booking with discount calculation

### Loyalty Points Enhancements
- Bank account redemption with account number and routing number validation
- Gift card and bank credit redemption options
- Points usage during booking process with real-time total calculation
- Enhanced validation and error handling

### Admin Dashboard Features
- Full CRUD operations for Services (Create, Read, Update, Delete)
- Full CRUD operations for Technicians
- Enhanced appointment management with detailed customer information
- Comprehensive settings management including business hours, notifications, payment options
- Image URL management for services with proper validation
