
# Beauty Plaza Online Hub - Complete Application Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [System Architecture](#system-architecture)
3. [Application Startup Flow](#application-startup-flow)
4. [Complete Request Documentation](#complete-request-documentation)
5. [User Workflows](#user-workflows)
6. [Backend Integration Strategy](#backend-integration-strategy)
7. [Data Models](#data-models)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Application Overview

Beauty Plaza Online Hub is a comprehensive beauty salon management system that allows customers to book appointments, manage loyalty points, and interact with various salon services. The application follows a multi-tier architecture with fallback mechanisms for high availability.

### Key Features
- **Online Appointment Booking**: Complete booking system with real-time availability
- **Multi-Service Selection**: Customers can book multiple services in one appointment
- **Loyalty Program**: Points-based reward system with tier management
- **In-Home Services**: Support for both in-store and at-home service delivery
- **Real-time Notifications**: Email confirmations and reminders
- **Admin Dashboard**: Complete management interface for salon operations

---

## System Architecture

### Frontend Architecture
```
React Application (TypeScript)
├── Pages (Route Components)
├── Components (UI Components)
├── Hooks (Business Logic)
├── Services (API Integration)
├── Contexts (State Management)
└── Utils (Helper Functions)
```

### Backend Integration Strategy
```
Primary: Spring Boot API (localhost:8080)
    ↓ (if unavailable)
Secondary: Supabase Database
    ↓ (if unavailable)
Tertiary: Local JSON Data + localStorage
```

---

## Application Startup Flow

### 1. Initial Application Load
**When:** User visits the website
**Process:**
1. React application initializes
2. Authentication context loads
3. Settings are fetched
4. Navigation menu is configured

#### Request Details:
```http
GET /api/health
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
Timeout: 3000ms
```

**Expected Response:**
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Fallback Behavior:**
- If Spring Boot unavailable → Supabase health check
- If both unavailable → Local mode with JSON data

### 2. Settings Initialization
**Purpose:** Load system-wide configuration
**Hook:** `useSettings()`

#### Primary Request (Spring Boot):
```http
GET /api/admin/settings
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
```

**Expected Response:**
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
  "contact_address_line1": "2604 Jacqueline Dr",
  "contact_address_line2": "Wilmington, DE - 19810",
  "business_hours": {
    "monday": {"open": "09:00", "close": "18:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "18:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "18:00", "closed": false},
    "thursday": {"open": "09:00", "close": "18:00", "closed": false},
    "friday": {"open": "09:00", "close": "18:00", "closed": false},
    "saturday": {"open": "09:00", "close": "17:00", "closed": false},
    "sunday": {"open": "10:00", "close": "16:00", "closed": false}
  },
  "navigation_settings": {
    "show_promotions": true,
    "show_loyalty": true,
    "show_gift_cards": true,
    "show_refer_friend": true
  }
}
```

#### Fallback Request (Supabase):
```javascript
// Via Supabase client
const { data, error } = await supabase.rpc('get_settings');
```

**Refresh Behavior:**
- Auto-refresh every 30 seconds
- Manual refresh via `refetch()` function

---

## Complete Request Documentation

### 1. Services Management

#### 1.1 Fetch All Services
**When:** Page load, service selection, admin management
**Hook:** `useServices()`, `useBookingData()`
**Cache Duration:** 30 minutes

##### Primary Request (Spring Boot):
```http
GET /api/services
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
```

**Expected Response:**
```json
[
  {
    "id": "1",
    "name": "Classic Facial",
    "description": "Deep cleansing facial with extractions",
    "price": 75.00,
    "duration": 60,
    "image_url": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "2",
    "name": "Classic Manicure",
    "description": "Professional nail care and polish application",
    "price": 35.00,
    "duration": 45,
    "image_url": "https://images.unsplash.com/photo-1604654894610-df63bc536371",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

##### Fallback Behavior:
1. **Supabase Fallback:**
```javascript
const { data, error } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true)
  .order('name');
```

2. **Local JSON Fallback:**
```javascript
// Uses src/data/services.json
import servicesData from "@/data/services.json";
```

### 1.2 Create Service (Admin Only)
**When:** Admin creates new service
**Route:** Admin Dashboard → Services Management

##### Request:
```http
POST /api/admin/services
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer {admin-token}

Body:
{
  "name": "Premium Facial",
  "description": "Luxury facial treatment with premium products",
  "price": 120.00,
  "duration": 90,
  "image_url": "https://images.unsplash.com/photo-example",
  "is_active": true
}
```

**Expected Response:**
```json
{
  "id": "3",
  "name": "Premium Facial",
  "description": "Luxury facial treatment with premium products",
  "price": 120.00,
  "duration": 90,
  "image_url": "https://images.unsplash.com/photo-example",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Technicians Management

#### 2.1 Fetch All Technicians
**When:** Booking flow, admin management
**Hook:** `useBookingData()`

##### Primary Request (Spring Boot):
```http
GET /api/technicians
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
```

**Expected Response:**
```json
[
  {
    "id": "1",
    "name": "Sarah Johnson",
    "specialties": ["Facial", "Anti-Aging"],
    "is_available": true,
    "image_url": "https://images.unsplash.com/photo-1594824092-b247a3b34ffc",
    "user_id": "user123",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "2", 
    "name": "Emily Davis",
    "specialties": ["Skincare", "Facial"],
    "is_available": true,
    "image_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
    "user_id": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

##### Fallback Behavior:
```javascript
// Uses src/data/technicians.json
import techniciansData from "@/data/technicians.json";
```

---

### 3. Appointment Booking System

#### 3.1 Check Available Time Slots
**When:** User selects date/technician in booking flow
**Hook:** `useBookingData.fetchMonthlyBookedData()`
**Frequency:** Every time user changes month/technician

##### Primary Request (Spring Boot):
```http
GET /api/appointments/slots?technicianId={id}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json

Example:
/api/appointments/slots?technicianId=1&startDate=2024-02-01&endDate=2024-02-29
```

**Expected Response:**
```json
{
  "2024-02-15": ["09:00", "10:30", "14:00", "16:30"],
  "2024-02-16": ["11:00", "15:30"],
  "2024-02-17": [],
  "2024-02-18": ["09:30", "13:00", "17:00"]
}
```

##### Fallback Behavior:
1. **Local Storage Check:**
```javascript
const bookedSlotsKey = `booked_slots_${technicianId}_${dateKey}`;
const localBookedSlots = JSON.parse(localStorage.getItem(bookedSlotsKey) || '[]');
```

2. **Demo Data Generation:**
```javascript
// Generates random booked slots for demonstration
const numBooked = Math.floor(Math.random() * 5);
bookedSlots = timeSlots.slice(0, numBooked);
```

#### 3.2 Book New Appointment
**When:** User completes booking flow
**Hook:** `useBookingActions.bookAppointment()`

##### Primary Request (Spring Boot):
```http
POST /api/appointments
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer {user-token}

Body:
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
  "status": "scheduled",
  "otpVerified": false
}
```

**Expected Response:**
```json
{
  "id": "apt123",
  "customerId": "user123",
  "serviceIds": ["1", "2"],
  "technicianId": "1",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "14:30",
  "serviceType": "in-home",
  "status": "scheduled",
  "confirmationNumber": "BP-2024-001",
  "totalAmount": 95.00,
  "loyaltyPointsUsed": 50,
  "loyaltyDiscount": 5.00,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

##### Post-Booking Actions:
1. **Update Local Storage:**
```javascript
localStorage.setItem(`booked_slots_${technicianId}_${appointmentDate}`, 
  JSON.stringify([...existingSlots, appointmentTime]));
```

2. **Send Email Confirmation:**
```javascript
// Via EmailJS
await emailjs.send('service_id', 'template_id', emailData);
```

##### Fallback Behavior (Supabase):
```javascript
const { data, error } = await supabase
  .from('appointments')
  .insert({
    customer_id: customerId,
    service_id: serviceIds[0],
    technician_id: technicianId,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    service_type: serviceType,
    total_amount: totalAmount,
    status: 'scheduled'
  });
```

#### 3.3 Fetch User Appointments
**When:** User visits "My Bookings" page
**Hook:** `useAppointments()`

##### Primary Request (Spring Boot):
```http
GET /api/appointments/user/{userId}
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer {user-token}
```

**Expected Response:**
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

##### Fallback Response (Mock Data):
```json
[
  {
    "id": "1",
    "appointment_date": "2024-01-20",
    "appointment_time": "10:00",
    "status": "scheduled",
    "total_amount": 75,
    "service_type": "in-store",
    "notes": "Regular manicure",
    "service": {
      "name": "Classic Manicure",
      "price": 75
    },
    "technician": {
      "name": "Sarah Johnson"
    }
  }
]
```

---

### 4. Email Notifications

#### 4.1 Appointment Confirmation Email
**When:** Immediately after successful booking
**Service:** EmailJS
**Template:** `apt_conf`

##### Email Service Configuration:
```javascript
// src/utils/emailService.ts
const emailData = {
  to_email: customerInfo.email,
  company_name: "Beauty Plaza",
  booking_confirmation: generateConfirmationNumber(),
  
  // Customer Information
  customerInfo_name: customerInfo.name,
  customerInfo_email: customerInfo.email,
  customerInfo_phone: customerInfo.phone,
  customerInfo_address: customerInfo.address,
  customerInfo_notes: customerInfo.notes,
  
  // Appointment Details
  appointment_date: formattedDate,
  appointment_time: selectedTime,
  serviceType: serviceType,
  totalAmount: totalAmount.toFixed(2),
  
  // Service Details (Multiple Services Support)
  selectedServices: selectedServices.map(service => ({
    name: service.name,
    price: service.price.toFixed(2),
    duration: service.duration
  })),
  
  // Technician Details
  selectedTechnicianDetails_name: selectedTechnician.name,
  
  // Loyalty Information
  loyaltyPointsUsed: loyaltyPointsUsed || 0,
  loyaltyDiscount: loyaltyDiscount || 0
};
```

##### EmailJS Request:
```javascript
await emailjs.send(
  'service_2s0k4ol', // Service ID
  'template_apt_conf', // Template ID
  emailData,
  'pMeKf3KZl8L7Hqk_o' // Public Key
);
```

**Email Template Variables:**
- `{{company_name}}` - Business name
- `{{customerInfo_name}}` - Customer name
- `{{selectedServices}}` - Array of selected services
- `{{appointment_date}}` - Formatted appointment date
- `{{appointment_time}}` - Selected time slot
- `{{serviceType}}` - "in-store" or "in-home"
- `{{totalAmount}}` - Final amount to pay
- `{{customerInfo_address}}` - For in-home services
- `{{loyaltyPointsUsed}}` - Points applied
- `{{booking_confirmation}}` - Unique confirmation number

---

### 5. Loyalty Points System

#### 5.1 Fetch User Loyalty Points
**When:** User visits profile, loyalty page, or during booking
**Hook:** `useLoyaltyPoints()`

##### Primary Request (Spring Boot):
```http
GET /api/loyalty/points/{userId}
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer {user-token}
```

**Expected Response:**
```json
{
  "userId": "user123",
  "currentPoints": 850,
  "totalEarned": 1200,
  "totalRedeemed": 350,
  "tier": "silver",
  "pointsToNextTier": 150,
  "nextTier": "gold"
}
```

#### 5.2 Redeem Loyalty Points
**When:** User applies points during booking or requests redemption
**Methods:** Gift card, Bank credit

##### Primary Request (Spring Boot):
```http
POST /api/loyalty/redeem
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer {user-token}

Body:
{
  "userId": "user123",
  "points": 100,
  "redemptionMethod": "gift_card",
  "dollarValue": 10.00
}
```

**Expected Response:**
```json
{
  "success": true,
  "transactionId": "txn_abc123",
  "remainingPoints": 750,
  "redemptionValue": 10.00,
  "giftCardCode": "GC-2024-001",
  "message": "Successfully redeemed 100 points for $10 gift card"
}
```

---

### 6. Admin Operations

#### 6.1 Update System Settings
**When:** Admin modifies settings via dashboard
**Route:** /admin-settings

##### Primary Request (Spring Boot):
```http
POST /api/admin/settings/{key}
Host: localhost:8080
Headers:
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer {admin-token}

Body:
{
  "value": {
    "show_promotions": false,
    "show_loyalty": true,
    "show_gift_cards": true,
    "show_refer_friend": false
  }
}
```

**Expected Response:**
```json
{
  "key": "navigation_settings",
  "value": {
    "show_promotions": false,
    "show_loyalty": true,
    "show_gift_cards": true,
    "show_refer_friend": false
  },
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## User Workflows

### 1. Complete Booking Workflow

#### Step 1: Service Selection
**Page:** `/book-online`
**Component:** `ServiceSelection`

1. **Load Services:**
   - Fetch from Spring Boot `/api/services`
   - Display with images, prices, descriptions
   - Allow multiple service selection

2. **User Actions:**
   - Select one or more services
   - View total price calculation
   - Continue to technician selection

#### Step 2: Technician & Service Type Selection
**Component:** `TechnicianAndTypeSelection`

1. **Load Technicians:**
   - Fetch from Spring Boot `/api/technicians`
   - Filter by service specialties
   - Display with photos and expertise

2. **Service Type Selection:**
   - In-store service (default)
   - In-home service (adds fee)
   - Update total price calculation

#### Step 3: Date & Time Selection
**Component:** `DateTimeSelection`

1. **Load Available Slots:**
   - Request: `GET /api/appointments/slots?technicianId={id}&startDate={start}&endDate={end}`
   - Display calendar with available dates
   - Show time slots for selected date
   - Block already booked times

2. **Real-time Updates:**
   - Refresh slots when changing technician
   - Update monthly view when changing months
   - Validate selected time is still available

#### Step 4: Customer Information
**Component:** `CustomerInformation`

1. **Form Fields:**
   - Name (required)
   - Email (required)
   - Phone (required)
   - Address (required for in-home service)
   - Special notes (optional)

2. **Address Handling:**
   - Auto-populate from user profile if available
   - Show address field only for in-home services
   - Validate address format and completeness

3. **Validation:**
   - Email format validation
   - Phone number format validation
   - Required field validation

#### Step 5: Loyalty Points (Optional)
**Component:** `LoyaltyPointsUsage`

1. **Load User Points:**
   - Fetch current balance
   - Calculate available discount
   - Show redemption rate

2. **Points Application:**
   - Slider/input for points to use
   - Real-time price calculation
   - Minimum redemption enforcement

#### Step 6: Payment Information
**Component:** `PaymentStep`

1. **Payment Methods:**
   - Credit Card
   - PayPal
   - Apple Pay
   - Cash (in-store only)

2. **Payment Processing:**
   - Validate payment method
   - Calculate final total
   - Process payment (if required)

#### Step 7: Confirmation
**Component:** `BookingConfirmation`

1. **Create Appointment:**
   - Submit booking request to Spring Boot
   - Handle response and errors
   - Generate confirmation number

2. **Send Notifications:**
   - Email confirmation to customer
   - Update calendar availability
   - Store booking in local storage (fallback)

3. **Success Actions:**
   - Display confirmation details
   - Provide calendar download
   - Redirect to success page

### 2. Appointment Management Workflow

#### View Appointments
**Page:** `/my-bookings`
**Hook:** `useAppointments()`

1. **Load User Appointments:**
   - Request: `GET /api/appointments/user/{userId}`
   - Display appointment list
   - Show status and details

2. **Appointment Actions:**
   - View details
   - Reschedule (if allowed)
   - Cancel (if allowed)
   - Download calendar event

#### Reschedule Appointment
**Component:** `RescheduleAppointment`

1. **Load Current Details:**
   - Display existing appointment info
   - Load available alternatives
   - Check rescheduling policies

2. **Select New Options:**
   - Choose new date/time
   - Change technician (if needed)
   - Confirm changes

3. **Update Appointment:**
   - Request: `PUT /api/appointments/{id}/reschedule`
   - Send update confirmation email
   - Update local state

#### Cancel Appointment
**Process:** Cancel booking

1. **Cancellation Request:**
   - Request: `PUT /api/appointments/{id}/cancel`
   - Provide cancellation reason
   - Check cancellation policy

2. **Post-Cancellation:**
   - Send cancellation confirmation
   - Update available time slots
   - Process any refunds

---

## Backend Integration Strategy

### Primary Integration: Spring Boot API

#### Connection Details:
- **Base URL:** `http://localhost:8080`
- **Health Check:** `/api/health`
- **Timeout:** 3000ms for health, 10000ms for operations
- **Authentication:** Bearer token in Authorization header

#### Endpoint Categories:
1. **Public Endpoints:**
   - `/api/health` - Health check
   - `/api/services` - Service catalog
   - `/api/technicians` - Available technicians
   - `/api/appointments/slots` - Time availability

2. **Authenticated Endpoints:**
   - `/api/appointments` - Booking operations
   - `/api/appointments/user/{id}` - User appointments
   - `/api/loyalty/*` - Loyalty operations

3. **Admin Endpoints:**
   - `/api/admin/settings` - System configuration
   - `/api/admin/services` - Service management
   - `/api/admin/technicians` - Staff management

### Secondary Integration: Supabase

#### Connection Details:
- **Project ID:** `75c8fd3e-47e9-4af3-a7f2-5c680eb63d3f`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Base URL:** `https://pfbnlwecxfomfgvpqdna.supabase.co`

#### Tables Used:
- `services` - Service catalog
- `technicians` - Staff information  
- `appointments` - Booking records
- `settings` - System configuration
- `loyalty_points` - User rewards
- `profiles` - User information

### Tertiary Fallback: Local Data

#### Local JSON Files:
- `src/data/services.json` - Default services
- `src/data/technicians.json` - Default staff
- `src/data/beautyservices.json` - Additional services

#### Local Storage Keys:
- `services_cache` - Cached service data
- `services_cache_expiry` - Cache expiration time
- `booked_slots_{technicianId}_{date}` - Appointment slots
- `user_appointments` - User booking history

### Integration Flow:

```
1. Health Check (Spring Boot)
   ↓ Success: Use Spring Boot API
   ↓ Failure: Try Supabase
   
2. Supabase Connection Test
   ↓ Success: Use Supabase
   ↓ Failure: Use Local Data
   
3. Local Data Mode
   ↓ Use JSON files + localStorage
   ↓ Limited functionality
```

---

## Data Models

### Service Model
```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### Technician Model
```typescript
interface Technician {
  id: string;
  name: string;
  specialties: string[];
  is_available: boolean;
  image_url?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Appointment Model
```typescript
interface Appointment {
  id: string;
  customerId: string;
  serviceIds: string[];
  technicianId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  serviceType: 'in-store' | 'in-home';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'paid';
  notes?: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  totalAmount: number;
  loyaltyPointsUsed?: number;
  loyaltyDiscount?: number;
  confirmationNumber?: string;
  created_at: string;
  updated_at: string;
}
```

### Settings Model
```typescript
interface Settings {
  service_prices: Record<string, number>;
  referral_amounts: {
    referrer_credit: number;
    referred_discount: number;
  };
  loyalty_settings: {
    points_per_dollar: number;
    min_redemption: number;
    redemption_rate: number;
  };
  loyalty_tiers: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
  in_home_fee: number;
  contact_phone: string;
  contact_email: string;
  contact_address_line1: string;
  contact_address_line2: string;
  business_hours: {
    [day: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  navigation_settings: {
    show_promotions: boolean;
    show_loyalty: boolean;
    show_gift_cards: boolean;
    show_refer_friend: boolean;
  };
}
```

---

## Error Handling

### Network Error Handling

#### Spring Boot Unavailable:
```javascript
try {
  const response = await fetch(buildApiUrl('/api/services'));
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Spring Boot API error');
} catch (error) {
  console.log('Spring Boot unavailable, trying Supabase...');
  // Fallback to Supabase
}
```

#### Supabase Unavailable:
```javascript
try {
  const { data, error } = await supabase.from('services').select('*');
  if (error) throw error;
  return data;
} catch (error) {
  console.log('Supabase unavailable, using local data...');
  // Fallback to local JSON
}
```

#### Complete Fallback Chain:
```javascript
const fetchServices = async () => {
  try {
    // 1. Try Spring Boot
    const springBootData = await fetchFromSpringBoot();
    setDataSource('spring-boot');
    return springBootData;
  } catch (springBootError) {
    try {
      // 2. Try Supabase
      const supabaseData = await fetchFromSupabase();
      setDataSource('supabase');
      return supabaseData;
    } catch (supabaseError) {
      // 3. Use Local Data
      const localData = await fetchFromLocal();
      setDataSource('local');
      return localData;
    }
  }
};
```

### User-Facing Error Messages:

#### Booking Errors:
- **"Selected time slot no longer available"** - Slot was booked by another user
- **"Please check your internet connection"** - Network connectivity issues
- **"Booking service temporarily unavailable"** - All backend services down
- **"Please complete all required fields"** - Form validation errors

#### Payment Errors:
- **"Payment processing failed"** - Payment gateway issues
- **"Invalid payment information"** - Form validation errors
- **"Payment service unavailable"** - Payment processor down

#### General Errors:
- **"Service temporarily unavailable"** - Backend service errors
- **"Please try again later"** - Temporary failures
- **"Unable to load data"** - Data fetching failures

---

## Performance Optimization

### Caching Strategy

#### Service Data Caching:
```javascript
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const setCachedServices = (servicesData) => {
  localStorage.setItem('services_cache', JSON.stringify(servicesData));
  localStorage.setItem('services_cache_expiry', 
    (Date.now() + CACHE_DURATION).toString());
};

const getCachedServices = () => {
  const cached = localStorage.getItem('services_cache');
  const expiry = localStorage.getItem('services_cache_expiry');
  
  if (cached && expiry && Date.now() < parseInt(expiry)) {
    return JSON.parse(cached);
  }
  return null;
};
```

#### Request Debouncing:
```javascript
// Debounce time slot requests when user changes dates quickly
const debouncedFetchSlots = useCallback(
  debounce(async (month, technicianId) => {
    await fetchMonthlyBookedData(month, technicianId);
  }, 300),
  [fetchMonthlyBookedData]
);
```

#### Image Optimization:
- Use Unsplash URLs for service images
- Implement lazy loading for service cards
- Cache images in browser storage

### Loading States:

#### Global Loading:
```javascript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
```

#### Component-Level Loading:
```javascript
const { services, isLoading, error } = useServices();
const { appointments, isLoading: appointmentsLoading } = useAppointments();
```

#### Loading UI Patterns:
- Skeleton screens for data loading
- Spinner for quick operations
- Progress bars for multi-step processes
- Disable buttons during submissions

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Backend Connection Issues

**Problem:** "Unable to connect to booking service"
**Diagnosis:**
```bash
# Check Spring Boot health
curl http://localhost:8080/api/health

# Check if Spring Boot is running
lsof -i :8080
```

**Solutions:**
1. Start Spring Boot application
2. Check application.properties configuration
3. Verify CORS settings allow frontend domain
4. Check firewall/network restrictions

#### 2. Email Notifications Not Sending

**Problem:** Appointment confirmations not received
**Diagnosis:**
1. Check EmailJS configuration
2. Verify service ID and template ID
3. Check email template variables
4. Review browser console for errors

**Solutions:**
1. Verify EmailJS credentials in environment
2. Test email template with sample data
3. Check spam/junk folders
4. Validate email addresses

#### 3. Time Slot Synchronization Issues

**Problem:** Double bookings or incorrect availability
**Diagnosis:**
1. Check localStorage data: `localStorage.getItem('booked_slots_1_2024-01-15')`
2. Verify Spring Boot appointment data
3. Check time zone settings

**Solutions:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh time slot data
3. Verify server time zone configuration
4. Check date formatting consistency

#### 4. Loyalty Points Not Updating

**Problem:** Points not reflecting after booking
**Diagnosis:**
1. Check user authentication
2. Verify appointment completion status
3. Check loyalty calculation logic

**Solutions:**
1. Re-authenticate user
2. Manually trigger points calculation
3. Check backend loyalty service
4. Verify point calculation rules

#### 5. Payment Processing Issues

**Problem:** Payment failures or incomplete transactions
**Diagnosis:**
1. Check payment gateway configuration
2. Verify SSL certificates
3. Review payment method validation

**Solutions:**
1. Update payment gateway credentials
2. Test with different payment methods
3. Check transaction logs
4. Verify merchant account status

### Development Tools

#### Console Commands for Debugging:

```javascript
// Check current data sources
console.log('Services source:', window.__BEAUTY_PLAZA_DEBUG?.servicesSource);
console.log('Cached services:', localStorage.getItem('services_cache'));

// Clear all caches
localStorage.clear();
sessionStorage.clear();

// Force refresh all data
window.location.reload();

// Check backend connectivity
fetch('http://localhost:8080/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

#### Useful Browser Extensions:
- **React Developer Tools** - Component debugging
- **Redux DevTools** - State management debugging
- **Network Tab** - API request monitoring
- **Application Tab** - LocalStorage inspection

### Logs to Monitor:

#### Frontend Console Logs:
- `"Services fetched from Spring Boot"` - Successful API calls
- `"Spring Boot unavailable, using Supabase"` - Fallback activation
- `"Email confirmation sent successfully"` - Email delivery
- `"Booking created successfully"` - Appointment creation

#### Spring Boot Application Logs:
- HTTP request/response logs
- Database connection status
- Authentication failures
- Business logic errors

#### Supabase Dashboard Logs:
- Query performance
- RLS policy violations
- Connection errors
- Data modification logs

---

## Conclusion

This documentation provides a complete overview of the Beauty Plaza Online Hub application, covering every request, workflow, and integration pattern. The multi-tier backend strategy ensures high availability while maintaining consistent user experience.

For additional support or questions about specific workflows, refer to the individual component documentation or contact the development team.

**Last Updated:** January 2024
**Version:** 1.0.0
**Maintained By:** Beauty Plaza Development Team
