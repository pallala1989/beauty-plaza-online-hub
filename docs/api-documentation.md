
# API Documentation

This document outlines all REST API endpoints available in the Beauty Plaza backend.

## Base URL
```
http://localhost:8080/api
```

## Authentication

Most endpoints require authentication. Use the following default admin credentials:
- **Username**: `admin`
- **Password**: `admin`
- **Email/Password**: `admin@beautyplaza.com` / `admin123`
- **Email/Password**: `test@admin.com` / `admin`

## Public Endpoints

### Health Check

#### GET /api/health
Check backend service health.

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Services

#### GET /api/services
Get all active services with images.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Classic Facial",
    "description": "Deep cleansing facial with extractions",
    "price": 75.00,
    "duration": 60,
    "image_url": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
    "is_active": true
  }
]
```

#### GET /api/services/{id}
Get service by ID.

**Response:**
```json
{
  "id": "1",
  "name": "Classic Facial",
  "description": "Deep cleansing facial with extractions",
  "price": 75.00,
  "duration": 60,
  "image_url": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
  "is_active": true
}
```

### Technicians

#### GET /api/technicians
Get all available technicians.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Sarah Johnson",
    "specialties": ["Facial", "Anti-Aging"],
    "is_available": true,
    "image_url": "https://images.unsplash.com/photo-1594824092-b247a3b34ffc"
  }
]
```

#### GET /api/technicians/{id}
Get technician by ID.

### Appointments

#### GET /api/appointments/slots
Get available time slots for booking.

**Parameters:**
- `technicianId` (required): Technician ID
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

**Response:**
```json
{
  "bookedSlots": {
    "2024-01-15": ["10:00", "14:00", "16:30"],
    "2024-01-16": ["09:00", "11:00"]
  }
}
```

#### POST /api/appointments
Book a new appointment.

**Request Body:**
```json
{
  "customerId": "uuid",
  "serviceId": "uuid",
  "technicianId": "uuid",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00",
  "serviceType": "in-store",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "notes": "First time customer",
  "totalAmount": 75.00,
  "status": "scheduled",
  "otpVerified": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "confirmationNumber": "BP-2024-001",
  "status": "confirmed",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00:00",
  "totalAmount": 75.00
}
```

#### GET /api/appointments/user/{userId}
Get user's appointments.

#### PUT /api/appointments/{id}/cancel
Cancel an appointment.

**Request Body:**
```json
{
  "reason": "Schedule conflict"
}
```

## Protected Endpoints (Admin Only)

### Admin Settings

#### GET /api/admin/settings
Get all application settings.

**Response:**
```json
{
  "service_prices": {
    "facial": 75,
    "haircut": 50
  },
  "referral_amounts": {
    "referrer_credit": 10,
    "referred_discount": 10
  },
  "loyalty_settings": {
    "points_per_dollar": 10,
    "min_redemption": 100,
    "redemption_rate": 10
  },
  "loyalty_tiers": {
    "bronze": 0,
    "silver": 500,
    "gold": 1000,
    "platinum": 2000
  },
  "in_home_fee": 25,
  "contact_phone": "(903) 921-0271",
  "contact_email": "info@beautyplaza.com",
  "contact_address_line1": "2604 Jacqueline Dr",
  "contact_address_line2": "Wilmington, DE - 19810",
  "navigation_settings": {
    "show_promotions": true,
    "show_loyalty": true,
    "show_gift_cards": true,
    "show_refer_friend": true
  }
}
```

#### POST /api/admin/settings/{key}
Update a specific setting.

**Request Body:**
```json
{
  "value": {
    "show_promotions": false,
    "show_loyalty": true,
    "show_gift_cards": true,
    "show_refer_friend": false
  }
}
```

### Service Management

#### POST /api/admin/services
Create a new service.

**Request Body:**
```json
{
  "name": "Premium Facial",
  "description": "Luxury facial treatment",
  "price": 120.00,
  "duration": 90,
  "image_url": "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae",
  "is_active": true
}
```

#### PUT /api/admin/services/{id}
Update an existing service.

#### DELETE /api/admin/services/{id}
Delete a service.

### Technician Management

#### GET /api/admin/technicians
Get all technicians (including inactive).

#### POST /api/admin/technicians
Create a new technician.

**Request Body:**
```json
{
  "name": "Emily Davis",
  "specialties": ["Skincare", "Facial"],
  "is_available": true,
  "image_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
}
```

#### PUT /api/admin/technicians/{id}
Update technician details.

#### DELETE /api/admin/technicians/{id}
Remove a technician.

### Appointment Management

#### GET /api/admin/appointments
Get all appointments with filters.

**Parameters:**
- `date`: Filter by date (YYYY-MM-DD)
- `status`: Filter by status
- `technicianId`: Filter by technician

**Response:**
```json
[
  {
    "id": "uuid",
    "customerId": "uuid",
    "serviceId": "uuid",
    "technicianId": "uuid",
    "appointmentDate": "2024-01-15",
    "appointmentTime": "10:00",
    "serviceType": "in-store",
    "status": "confirmed",
    "customerPhone": "+1234567890",
    "customerEmail": "john@example.com",
    "totalAmount": 75.00,
    "notes": "First time customer",
    "createdAt": "2024-01-10T10:00:00Z"
  }
]
```

#### PUT /api/admin/appointments/{id}/status
Update appointment status.

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Customer confirmed via phone"
}
```

### Customer Management

#### GET /api/admin/customers
Get all customers.

**Response:**
```json
[
  {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "totalAppointments": 5,
    "totalSpent": 375.00,
    "lastVisit": "2024-01-15",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

#### GET /api/admin/customers/{id}
Get customer details with appointment history.

## Loyalty System

### Points Redemption

#### POST /api/loyalty/redeem
Redeem loyalty points.

**Request Body:**
```json
{
  "userId": "uuid",
  "points": 100,
  "redemptionMethod": "gift_card",
  "dollarValue": 10.00
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "pointsRedeemed": 100,
  "dollarValue": 10.00,
  "redemptionMethod": "gift_card",
  "status": "completed",
  "giftCardCode": "GC-2024-001",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

#### GET /api/loyalty/points/{userId}
Get user's loyalty points balance.

**Response:**
```json
{
  "userId": "uuid",
  "currentPoints": 850,
  "totalEarned": 1200,
  "totalRedeemed": 350,
  "tier": "silver"
}
```

## Gift Cards

#### POST /api/gift-cards
Purchase a gift card.

**Request Body:**
```json
{
  "amount": 100.00,
  "recipientName": "Jane Doe",
  "recipientEmail": "jane@example.com",
  "buyerEmail": "john@example.com",
  "message": "Happy Birthday!"
}
```

#### GET /api/gift-cards/{code}
Get gift card details.

#### POST /api/gift-cards/{code}/redeem
Redeem a gift card.

## Referrals

#### POST /api/referrals
Create a referral.

**Request Body:**
```json
{
  "referrerId": "uuid",
  "referredEmail": "friend@example.com",
  "referrerCredit": 10.00,
  "referredDiscount": 10.00
}
```

#### GET /api/referrals/user/{userId}
Get user's referrals.

## Promotions

#### GET /api/promotions
Get active promotions.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "New Customer Special",
    "description": "50% off first visit",
    "code": "WELCOME50",
    "discountPercentage": 50,
    "validFrom": "2024-01-01T00:00:00Z",
    "validUntil": "2024-12-31T23:59:59Z",
    "maxUses": 100,
    "currentUses": 25,
    "isActive": true
  }
]
```

#### POST /api/promotions/validate
Validate a promotion code.

**Request Body:**
```json
{
  "code": "WELCOME50",
  "serviceId": "uuid",
  "userId": "uuid"
}
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

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production deployment.

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `https://preview--beauty-plaza-online-hub.lovable.app` (Lovable preview)

For production, update the CORS configuration in `SecurityConfig.java`.

## New Features Added

### Admin Dashboard Enhancements
- Full CRUD operations for services and technicians
- Enhanced appointment management with status updates
- Customer management with detailed views
- Comprehensive system settings

### Loyalty Program Enhancements
- Multiple redemption methods (gift card, bank credit)
- Tier-based loyalty system
- Points history tracking

### Navigation Control
- Admin can enable/disable navigation menu items
- Settings control visibility of promotions, loyalty, gift cards, and referral features

### Service Image Caching
- Images are cached locally for 30 minutes
- Automatic fallback to cached data when backend is unavailable
- Cache invalidation and refresh capabilities

### Settings Management
- Contact information management
- Navigation visibility controls
- Loyalty tier configuration
- Referral program settings
