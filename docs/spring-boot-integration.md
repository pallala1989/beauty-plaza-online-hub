# Spring Boot Backend Integration Guide

## Overview

This document outlines the integration between the Beauty Plaza frontend (React/TypeScript) and the Spring Boot backend. The system uses a fallback approach where it first tries to connect to the Spring Boot backend, then falls back to Supabase, and finally to local data.

## Supabase Configuration

### Project Details
- **Project ID**: rmngcnmwifrcuztflrhp
- **Project URL**: https://rmngcnmwifrcuztflrhp.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbmdjbm13aWZyY3V6dGZscmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDA4ODUsImV4cCI6MjA3MTYxNjg4NX0.U7ToGuLaNfRtuPzALE5-xMYk3Z2cocYL8ph0Uh5PRO0

## Backend Configuration

### Environment Setup

The backend configuration is managed through `src/config/environment.ts`:

```typescript
export const config = {
  SPRING_BOOT_BASE_URL: import.meta.env.VITE_SPRING_BOOT_URL || 'http://localhost:8080',
  // ... other config
};

export const buildApiUrl = (endpoint: string): string => {
  return `${config.SPRING_BOOT_BASE_URL}${endpoint}`;
};
```

### Required Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SPRING_BOOT_URL=http://localhost:8080
VITE_SUPABASE_URL=https://rmngcnmwifrcuztflrhp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbmdjbm13aWZyY3V6dGZscmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDA4ODUsImV4cCI6MjA3MTYxNjg4NX0.U7ToGuLaNfRtuPzALE5-xMYk3Z2cocYL8ph0Uh5PRO0
```

## API Endpoints

### Services API

**GET** `/api/services`
- Fetches all active services
- Response: Array of service objects

**GET** `/api/services/{id}`
- Fetches a specific service
- Response: Single service object

### Technicians API

**GET** `/api/technicians`
- Fetches all available technicians
- Response: Array of technician objects

**GET** `/api/technicians/{id}`
- Fetches a specific technician
- Response: Single technician object

### Appointments API

**POST** `/api/appointments`
- Creates a new appointment
- Request Body:
  ```json
  {
    "customerId": "string",
    "serviceIds": ["string"],
    "technicianId": "string",
    "appointmentDate": "yyyy-MM-dd",
    "appointmentTime": "HH:mm",
    "serviceType": "in-store|in-home",
    "notes": "string",
    "customerPhone": "string",
    "customerEmail": "string",
    "customerAddress": "string",
    "totalAmount": number,
    "loyaltyPointsUsed": number,
    "status": "scheduled"
  }
  ```

**GET** `/api/appointments/user/{userId}`
- Fetches appointments for a specific user
- Response: Array of appointment objects with service and technician details

**GET** `/api/appointments/slots`
- Query Parameters:
  - `technicianId`: string
  - `startDate`: yyyy-MM-dd
  - `endDate`: yyyy-MM-dd
- Response: Object with date keys and arrays of booked time slots

**PUT** `/api/appointments/{id}/cancel`
- Cancels an appointment
- Response: Updated appointment object

### Settings API

**GET** `/api/admin/settings`
- Fetches all system settings
- Response: Settings object

**POST** `/api/admin/settings/{key}`
- Updates a specific setting
- Request Body: `{ "value": any }`

### Health Check

**GET** `/api/health`
- Health check endpoint
- Response: `{ "status": "UP" }`

## Data Models

### Service Model
```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url: string;
  is_active: boolean;
}
```

### Technician Model
```typescript
interface Technician {
  id: string;
  name: string;
  specialties: string[];
  is_available: boolean;
  user_id?: string;
}
```

### Appointment Model
```typescript
interface Appointment {
  id: string;
  customerId: string;
  serviceIds: string[];
  technicianId: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  notes: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  totalAmount: number;
  loyaltyPointsUsed: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
```

## Frontend Integration Points

### Hooks Integration

1. **useBookingData**: Fetches services, technicians, and availability data
2. **useBookingActions**: Handles appointment booking logic
3. **useAppointments**: Manages user appointment history
4. **useServices**: Service data management with caching
5. **useSettings**: System settings management

### Error Handling

The system implements a three-tier fallback approach:

1. **Primary**: Spring Boot backend
2. **Secondary**: Supabase database
3. **Tertiary**: Local JSON data/localStorage

### Authentication

All API calls include the user ID in the Authorization header:
```typescript
headers: {
  'Authorization': `Bearer ${user.id}`,
  'Content-Type': 'application/json'
}
```

## Development Setup

### 1. Start Spring Boot Backend

Ensure your Spring Boot application is running on `http://localhost:8080`

### 2. Frontend Configuration

The frontend automatically detects backend availability through health checks.

### 3. Testing Backend Connectivity

1. Open browser dev tools
2. Check network tab for API calls
3. Look for console logs indicating data source:
   - "Services fetched from Spring Boot backend"
   - "Spring Boot unavailable, using local data"

## Deployment Considerations

### Production Environment

Update the backend URL in production:

```env
VITE_SPRING_BOOT_URL=https://your-production-backend.com
```

### CORS Configuration

Ensure your Spring Boot backend allows requests from your frontend domain:

```java
@CrossOrigin(origins = {"http://localhost:5173", "https://your-frontend-domain.com"})
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Configure CORS in Spring Boot
2. **Connection Refused**: Verify backend is running on correct port
3. **Authentication Errors**: Check Authorization header format
4. **Data Format Mismatches**: Verify API response matches frontend models

### Debug Mode

Enable debug logging by checking console output for:
- API call attempts
- Fallback activations
- Error messages

### Health Check

Test backend connectivity:
```bash
curl http://localhost:8080/api/health
```

Should return: `{"status":"UP"}`

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live appointment updates
2. **Caching Strategy**: Redis integration for improved performance
3. **Load Balancing**: Multiple backend instance support
4. **Monitoring**: Health metrics and performance monitoring

## Support

For backend integration issues:
1. Check Spring Boot application logs
2. Verify database connectivity
3. Test API endpoints with tools like Postman
4. Review frontend console for error messages
