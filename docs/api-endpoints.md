
# Beauty Plaza API Documentation

## Base URL
```
http://localhost:8080 (Development)
https://api.beautyplaza.com (Production)
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {user_id}
```

## Health Check

### GET /api/health
Check if the API is running and healthy.

**Response:**
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Services

### GET /api/services
Retrieve all active services.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Classic Manicure",
    "description": "Professional nail care and polish application",
    "price": 35.00,
    "duration": 45,
    "image_url": "/images/manicure.jpg",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/services/{id}
Retrieve a specific service by ID.

**Parameters:**
- `id` (path): Service ID

**Response:**
```json
{
  "id": "1",
  "name": "Classic Manicure",
  "description": "Professional nail care and polish application",
  "price": 35.00,
  "duration": 45,
  "image_url": "/images/manicure.jpg",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Technicians

### GET /api/technicians
Retrieve all available technicians.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Sarah Johnson",
    "specialties": ["Manicures", "Pedicures", "Nail Art"],
    "is_available": true,
    "user_id": "user123",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/technicians/{id}
Retrieve a specific technician by ID.

**Parameters:**
- `id` (path): Technician ID

**Response:**
```json
{
  "id": "1",
  "name": "Sarah Johnson",
  "specialties": ["Manicures", "Pedicures", "Nail Art"],
  "is_available": true,
  "user_id": "user123",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Appointments

### POST /api/appointments
Create a new appointment.

**Request Body:**
```json
{
  "customerId": "user123",
  "serviceIds": ["1", "2"],
  "technicianId": "1",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "14:30",
  "serviceType": "in-home",
  "notes": "Please bring extra nail colors",
  "customerPhone": "+1234567890",
  "customerEmail": "customer@email.com",
  "customerAddress": "123 Main St, City, State 12345",
  "totalAmount": 95.00,
  "loyaltyPointsUsed": 50,
  "loyaltyDiscount": 5.00,
  "status": "scheduled"
}
```

**Response:**
```json
{
  "id": "apt123",
  "customerId": "user123",
  "serviceIds": ["1", "2"],
  "technicianId": "1",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "14:30",
  "serviceType": "in-home",
  "notes": "Please bring extra nail colors",
  "customerPhone": "+1234567890",
  "customerEmail": "customer@email.com",
  "customerAddress": "123 Main St, City, State 12345",
  "totalAmount": 95.00,
  "loyaltyPointsUsed": 50,
  "loyaltyDiscount": 5.00,
  "status": "scheduled",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### GET /api/appointments/user/{userId}
Retrieve appointments for a specific user.

**Parameters:**
- `userId` (path): User ID

**Headers:**
- `Authorization: Bearer {user_id}`

**Response:**
```json
[
  {
    "id": "apt123",
    "appointment_date": "2024-02-15",
    "appointment_time": "14:30",
    "status": "scheduled",
    "total_amount": 95.00,
    "service_type": "in-home",
    "notes": "Please bring extra nail colors",
    "customer_email": "customer@email.com",
    "customer_phone": "+1234567890",
    "customer_address": "123 Main St, City, State 12345",
    "service": {
      "name": "Classic Manicure + Pedicure",
      "price": 95.00
    },
    "technician": {
      "name": "Sarah Johnson"
    },
    "services": [
      {
        "name": "Classic Manicure",
        "price": 35.00
      },
      {
        "name": "Classic Pedicure", 
        "price": 45.00
      }
    ]
  }
]
```

### GET /api/appointments/slots
Get booked time slots for scheduling.

**Query Parameters:**
- `technicianId` (required): Technician ID
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Example:**
```
GET /api/appointments/slots?technicianId=1&startDate=2024-02-01&endDate=2024-02-29
```

**Response:**
```json
{
  "2024-02-15": ["09:00", "10:30", "14:00"],
  "2024-02-16": ["11:00", "15:30"],
  "2024-02-17": []
}
```

### PUT /api/appointments/{id}/cancel
Cancel an appointment.

**Parameters:**
- `id` (path): Appointment ID

**Headers:**
- `Authorization: Bearer {user_id}`

**Response:**
```json
{
  "id": "apt123",
  "status": "cancelled",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### PUT /api/appointments/{id}/reschedule
Reschedule an appointment.

**Parameters:**
- `id` (path): Appointment ID

**Request Body:**
```json
{
  "appointmentDate": "2024-02-20",
  "appointmentTime": "10:00",
  "technicianId": "2"
}
```

**Response:**
```json
{
  "id": "apt123",
  "appointmentDate": "2024-02-20",
  "appointmentTime": "10:00",
  "technicianId": "2",
  "status": "rescheduled",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Settings (Admin)

### GET /api/admin/settings
Retrieve all system settings.

**Headers:**
- `Authorization: Bearer {admin_user_id}`

**Response:**
```json
{
  "service_prices": {
    "facial": 75,
    "haircut": 50,
    "manicure": 35,
    "pedicure": 45
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
  "in_home_fee": 25,
  "loyalty_tiers": {
    "bronze": 0,
    "silver": 500,
    "gold": 1000,
    "platinum": 2000
  },
  "contact_phone": "(903) 921-0271",
  "contact_email": "info@beautyplaza.com",
  "business_hours": {
    "monday": {"open": "09:00", "close": "18:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "18:00", "closed": false}
  }
}
```

### POST /api/admin/settings/{key}
Update a specific setting.

**Parameters:**
- `key` (path): Setting key

**Headers:**
- `Authorization: Bearer {admin_user_id}`

**Request Body:**
```json
{
  "value": "new_value"
}
```

**Response:**
```json
{
  "key": "in_home_fee",
  "value": 30,
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limiting

API endpoints are rate limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated endpoints

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Pagination

For endpoints that return large datasets, pagination is supported:

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort field and direction (e.g., `name,asc`)

**Response Headers:**
```
X-Total-Count: 150
X-Page-Count: 8
X-Current-Page: 0
```

## Webhooks

The API supports webhooks for real-time notifications:

### Appointment Events
- `appointment.created`
- `appointment.updated`
- `appointment.cancelled`

### Configuration
POST to `/api/admin/webhooks` to configure webhook endpoints.
