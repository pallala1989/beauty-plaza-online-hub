
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

JWT-based authentication is used for all protected endpoints.

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
  "imageUrl": "string",
  "userId": "string (optional)"
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
  "status": "string (scheduled|confirmed|completed|cancelled|paid)",
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

### User Entity
```json
{
  "id": "string",
  "email": "string",
  "fullName": "string",
  "phone": "string",
  "role": "string (admin|technician|user)",
  "isActive": "boolean",
  "createdAt": "timestamp"
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

### 2. Authentication Endpoints

#### Login
```
POST /api/auth/login
Request Body: {
  "email": "string",
  "password": "string"
}
Response: {
  "token": "jwt-token",
  "user": User,
  "expiresIn": "number"
}
```

#### Register
```
POST /api/auth/register
Request Body: {
  "email": "string",
  "password": "string",
  "fullName": "string",
  "phone": "string"
}
Response: {
  "token": "jwt-token",
  "user": User,
  "expiresIn": "number"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Headers: Authorization: Bearer <token>
Response: {
  "token": "new-jwt-token",
  "expiresIn": "number"
}
```

### 3. Services Management

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
Headers: Authorization: Bearer <admin-token>
Request Body: Service (without id)
Response: Service
```

#### Update Service (Admin)
```
PUT /api/admin/services/{id}
Headers: Authorization: Bearer <admin-token>
Request Body: Service
Response: Service
```

#### Delete Service (Admin)
```
DELETE /api/admin/services/{id}
Headers: Authorization: Bearer <admin-token>
Response: 204 No Content
```

### 4. Technicians Management

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
Headers: Authorization: Bearer <admin-token>
Request Body: Technician (without id)
Response: Technician
```

#### Update Technician (Admin)
```
PUT /api/admin/technicians/{id}
Headers: Authorization: Bearer <admin-token>
Request Body: Technician
Response: Technician
```

#### Delete Technician (Admin)
```
DELETE /api/admin/technicians/{id}
Headers: Authorization: Bearer <admin-token>
Response: 204 No Content
```

### 5. Appointments Management

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
Headers: Authorization: Bearer <token>
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
Headers: Authorization: Bearer <token>
Response: Appointment[]
```

#### Get All Appointments (Admin)
```
GET /api/admin/appointments?date={YYYY-MM-DD}&status={status}&technicianId={id}
Headers: Authorization: Bearer <admin-token>
Response: Appointment[]
```

#### Update Appointment Status (Admin)
```
PUT /api/admin/appointments/{id}/status
Headers: Authorization: Bearer <admin-token>
Request Body: {
  "status": "confirmed|completed|cancelled|paid",
  "notes": "string"
}
Response: Appointment
```

#### Cancel Appointment
```
PUT /api/appointments/{id}/cancel
Headers: Authorization: Bearer <token>
Request Body: {
  "reason": "string"
}
Response: Appointment
```

#### Reschedule Appointment
```
PUT /api/appointments/{id}/reschedule
Headers: Authorization: Bearer <token>
Request Body: {
  "appointmentDate": "YYYY-MM-DD",
  "appointmentTime": "HH:mm",
  "technicianId": "string"
}
Response: Appointment
```

### 6. Loyalty Points Management

#### Redeem Points
```
POST /api/loyalty/redeem
Headers: Authorization: Bearer <token>
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
Headers: Authorization: Bearer <token>
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
Headers: Authorization: Bearer <token>
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

### 7. Settings Management (Admin)

#### Get All Settings
```
GET /api/admin/settings
Headers: Authorization: Bearer <admin-token>
Response: Settings (complete settings object)
```

#### Update Setting
```
POST /api/admin/settings/{key}
Headers: Authorization: Bearer <admin-token>
Request Body: {
  "value": "any"
}
Response: { "key": "string", "value": "any" }
```

#### Update Business Hours
```
POST /api/admin/settings/business-hours
Headers: Authorization: Bearer <admin-token>
Request Body: {
  "monday": {"open": "09:00", "close": "18:00", "closed": false},
  "tuesday": {"open": "09:00", "close": "18:00", "closed": false}
}
Response: { "success": true }
```

#### Update Navigation Settings
```
POST /api/admin/settings/navigation
Headers: Authorization: Bearer <admin-token>
Request Body: {
  "showPromotions": true,
  "showLoyalty": true,
  "showGiftCards": true,
  "showReferFriend": true
}
Response: { "success": true }
```

### 8. User Management (Admin)

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <admin-token>
Response: User[]
```

#### Get User by ID
```
GET /api/admin/users/{id}
Headers: Authorization: Bearer <admin-token>
Response: User
```

#### Update User Role
```
PUT /api/admin/users/{id}/role
Headers: Authorization: Bearer <admin-token>
Request Body: {
  "role": "admin|technician|user"
}
Response: User
```

#### Deactivate User
```
PUT /api/admin/users/{id}/deactivate
Headers: Authorization: Bearer <admin-token>
Response: { "success": true }
```

## Business Logic Requirements

### Appointment Status Workflow
1. **scheduled** → **confirmed** → **completed** → **paid**
2. **scheduled** → **cancelled**
3. **confirmed** → **cancelled**

### Payment Status Restrictions
- Appointments with status `paid`, `completed`, or `cancelled` cannot be:
  - Rescheduled
  - Cancelled
  - Have payment processed again
- Only appointments with status `confirmed`, `scheduled`, or `completed` can have payments processed
- Once an appointment is marked as `paid`, no modifications are allowed

### Loyalty Points Calculation
- Points earned: `totalAmount * pointsPerDollar`
- Points redeemed: `pointsUsed / redemptionRate = dollarDiscount`
- Minimum redemption: `minRedemption` points

### Service Type Fees
- In-home services include additional `inHomeFee`
- Total calculation: `servicePrice + (serviceType === 'in-home' ? inHomeFee : 0) - loyaltyDiscount`

## Error Responses

All endpoints return consistent error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request", 
  "message": "Validation failed",
  "path": "/api/appointments",
  "details": ["specific error messages"]
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
- `409` - Conflict (e.g., appointment time slot already booked)
- `422` - Unprocessable Entity (business rule violation)
- `500` - Internal Server Error

## Security Requirements

### JWT Token Structure
```json
{
  "sub": "userId",
  "email": "user@example.com",
  "role": "admin|technician|user",
  "iat": "timestamp",
  "exp": "timestamp"
}
```

### Role-Based Access Control
- **Public**: Health check, services list, technicians list, time slots
- **Authenticated**: Book appointment, view own appointments, cancel own appointments
- **Admin**: All endpoints, user management, settings management
- **Technician**: View assigned appointments, update appointment status

### Admin Bypass Credentials
For testing purposes, these credentials bypass normal authentication:
- `admin@beautyplaza.com` / `admin123`
- `test@admin.com` / `admin`
- `admin` / `admin`

## Database Schema

### Key Relationships
- `appointments.customer_id` → `users.id`
- `appointments.service_id` → `services.id`
- `appointments.technician_id` → `technicians.id`
- `loyalty_points.user_id` → `users.id`
- `loyalty_points.appointment_id` → `appointments.id`
- `technicians.user_id` → `users.id` (optional)

### Indexes Required
- `appointments(appointment_date, appointment_time, technician_id)` - for availability checking
- `appointments(customer_id, created_at)` - for user appointment history
- `loyalty_points(user_id, created_at)` - for points history
- `users(email)` - for authentication
- `users(role)` - for role-based queries

## CORS Configuration

The API should accept requests from:
- `http://localhost:3000` (React development server)
- `https://preview--beauty-plaza-online-hub.lovable.app` (Lovable preview)

## Rate Limiting (Recommended)

- Authentication endpoints: 5 requests per minute per IP
- Booking endpoints: 10 requests per minute per user
- General API: 100 requests per minute per user

## Caching Strategy (Recommended)

- Settings: Cache for 5 minutes
- Services list: Cache for 30 minutes
- Technicians list: Cache for 15 minutes
- Available time slots: Cache for 2 minutes

## Sample Data Requirements

### Default Admin User
```sql
INSERT INTO users (id, email, password, full_name, role, is_active) 
VALUES ('admin-1', 'admin@beautyplaza.com', '$2a$10$hashed_password', 'Admin User', 'admin', true);
```

### Sample Services
```sql
INSERT INTO services (name, description, price, duration, image_url, is_active) VALUES
('Classic Facial', 'Deep cleansing facial with extractions', 75.00, 60, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881', true),
('Anti-Aging Treatment', 'Advanced anti-aging facial', 120.00, 90, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae', true),
('Classic Manicure', 'Professional nail care and polish', 35.00, 45, 'https://images.unsplash.com/photo-1604654894610-df63bc536371', true);
```

### Sample Technicians
```sql
INSERT INTO technicians (id, name, specialties, is_available, image_url) VALUES
('tech-1', 'Sarah Johnson', '["Facial", "Anti-Aging"]', true, 'https://images.unsplash.com/photo-1594824092-b247a3b34ffc'),
('tech-2', 'Emily Davis', '["Skincare", "Facial"]', true, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d'),
('tech-3', 'Lisa Chen', '["Manicure", "Pedicure"]', true, 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f');
```

### Default Settings
```sql
INSERT INTO settings (setting_key, setting_value) VALUES
('loyalty_settings', '{"pointsPerDollar": 10, "minRedemption": 100, "redemptionRate": 10}'),
('referral_amounts', '{"referrerCredit": 10, "referredDiscount": 10}'),
('in_home_fee', '25'),
('navigation_settings', '{"showPromotions": true, "showLoyalty": true, "showGiftCards": true, "showReferFriend": true}');
```

This specification provides complete guidance for implementing a Spring Boot backend that fully supports the Beauty Plaza frontend application with all required business logic, security, and data management capabilities.
