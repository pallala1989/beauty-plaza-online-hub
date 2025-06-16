
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

## Public Endpoints

### Services

#### GET /api/services
Get all active services.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Classic Facial",
    "description": "Deep cleansing facial with extractions",
    "price": 75.00,
    "duration": 60,
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true
  }
]
```

#### GET /api/services/{id}
Get service by ID.

### Technicians

#### GET /api/technicians
Get all available technicians.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sarah Johnson",
    "specialties": ["Facial", "Anti-Aging"],
    "isAvailable": true
  }
]
```

### Appointments

#### GET /api/appointments/slots
Get available time slots for booking.

**Parameters:**
- `date` (required): Date in YYYY-MM-DD format
- `technicianId` (required): Technician ID
- `serviceId` (optional): Service ID for duration calculation

**Response:**
```json
{
  "date": "2024-01-15",
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"]
}
```

#### POST /api/appointments/book
Book a new appointment.

**Request Body:**
```json
{
  "serviceId": 1,
  "technicianId": 1,
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00",
  "serviceType": "in-store",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "notes": "First time customer"
}
```

**Response:**
```json
{
  "id": 123,
  "confirmationNumber": "BP-2024-001",
  "status": "confirmed",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00:00"
}
```

## Protected Endpoints (Admin Only)

### Admin Settings

#### GET /api/admin/settings
Get all application settings.

**Response:**
```json
{
  "servicePrices": {
    "facial": 75,
    "haircut": 50
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
  "inHomeFee": 25
}
```

#### POST /api/admin/settings/{key}
Update a specific setting.

**Request Body:**
```json
{
  "value": 30
}
```

### Service Management

#### POST /api/admin/services
Create a new service.

#### PUT /api/admin/services/{id}
Update an existing service.

#### DELETE /api/admin/services/{id}
Delete a service.

### Technician Management

#### POST /api/admin/technicians
Create a new technician.

#### PUT /api/admin/technicians/{id}
Update technician details.

#### DELETE /api/admin/technicians/{id}
Remove a technician.

### Appointment Management

#### GET /api/admin/appointments
Get all appointments with filters.

**Parameters:**
- `date`: Filter by date
- `status`: Filter by status
- `technicianId`: Filter by technician

#### PUT /api/admin/appointments/{id}/status
Update appointment status.

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Customer confirmed via phone"
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
  "path": "/api/appointments/book"
}
```

## Status Codes

- `200` - Success
- `201` - Created
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

For production, update the CORS configuration in `SecurityConfig.java`.
