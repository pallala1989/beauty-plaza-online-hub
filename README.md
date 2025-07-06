
# Beauty Plaza Online Hub

A comprehensive beauty salon management system built with React, TypeScript, and Spring Boot, featuring online appointment booking, loyalty programs, and administrative tools.

## 🌟 Features

### Customer Features
- **Multi-Service Booking**: Book multiple services in a single appointment
- **Real-Time Availability**: Live calendar with available time slots
- **In-Home Services**: Book services at your location with address management
- **Loyalty Program**: Earn and redeem points with tier-based rewards
- **Email Confirmations**: Automated booking confirmations with EmailJS
- **Appointment Management**: View, reschedule, and cancel bookings
- **Responsive Design**: Optimized for desktop and mobile devices

### Admin Features
- **Dashboard Analytics**: Comprehensive overview of business metrics
- **Service Management**: Create, update, and manage service offerings
- **Staff Management**: Manage technicians and their specialties
- **Settings Control**: Configure business hours, pricing, and policies
- **Appointment Oversight**: View and manage all customer bookings

### Technical Features
- **Multi-Tier Backend**: Spring Boot → Supabase → Local JSON fallback
- **Real-Time Updates**: Live appointment availability checking
- **Offline Capability**: LocalStorage fallback for critical functions
- **Email Integration**: EmailJS for automated notifications
- **Caching System**: 30-minute service data caching for performance

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **React Query** for data fetching and caching
- **React Router** for navigation
- **EmailJS** for email notifications

### Backend Integration Strategy
```
Primary: Spring Boot API (localhost:8080)
    ↓ (if unavailable)
Secondary: Supabase Database
    ↓ (if unavailable)
Tertiary: Local JSON Data + localStorage
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Spring Boot application (optional, has fallbacks)
- EmailJS account for notifications

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/beauty-plaza-online-hub.git
cd beauty-plaza-online-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file:
```env
VITE_SPRING_BOOT_URL=http://localhost:8080
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

4. **Start the development server**
```bash
npm run dev
```

5. **Access the application**
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Documentation

### Core Documentation
- [**Complete App Documentation**](./docs/complete-app-documentation.md) - Comprehensive guide covering all workflows and integrations
- [**API Specification**](./docs/api-specification.md) - Detailed backend API documentation
- [**Spring Boot Integration**](./docs/spring-boot-integration.md) - Backend integration guide

### Additional Resources
- [**API Endpoints**](./docs/api-endpoints.md) - Complete endpoint reference
- [**Authentication Guide**](./docs/authentication.md) - Security implementation details

## 🔧 Configuration

### Backend Configuration
The application uses a three-tier fallback system:

1. **Spring Boot API** (Primary)
   - Base URL: `http://localhost:8080`
   - Health check: `/api/health`
   - Full REST API with all features

2. **Supabase** (Secondary)
   - Fallback database with RLS policies
   - Real-time subscriptions
   - Authentication support

3. **Local Data** (Tertiary)
   - JSON files for service/technician data
   - localStorage for appointments
   - Limited functionality mode

### Email Configuration
Set up EmailJS for appointment confirmations:

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Configure email service and template
3. Update environment variables
4. Test email delivery

## 📱 Usage

### For Customers

1. **Browse Services**
   - View available services with descriptions and pricing
   - Compare different treatment options

2. **Book Appointments**
   - Select multiple services
   - Choose preferred technician
   - Pick available date and time
   - Provide contact information
   - Apply loyalty points (if available)

3. **Manage Bookings**
   - View appointment history
   - Reschedule or cancel appointments
   - Download calendar events

### For Administrators

1. **Access Admin Dashboard**
   - Login with admin credentials
   - View business analytics

2. **Manage Services**
   - Add new services
   - Update pricing and descriptions
   - Manage service availability

3. **Staff Management**
   - Add technicians
   - Update specialties
   - Manage availability

4. **System Configuration**
   - Set business hours
   - Configure loyalty program
   - Update contact information

## 🔌 API Integration

### Spring Boot Endpoints

#### Public Endpoints
```http
GET /api/health                          # Health check
GET /api/services                        # Service catalog
GET /api/technicians                     # Available staff
GET /api/appointments/slots               # Time availability
```

#### Authenticated Endpoints
```http
POST /api/appointments                    # Book appointment
GET /api/appointments/user/{id}           # User bookings
PUT /api/appointments/{id}/cancel         # Cancel booking
```

#### Admin Endpoints
```http
GET /api/admin/settings                   # System settings
POST /api/admin/services                  # Create service
PUT /api/admin/technicians/{id}           # Update technician
```

### Example Booking Request
```javascript
const bookingData = {
  customerId: "user123",
  serviceIds: ["service1", "service2"],
  technicianId: "tech1",
  appointmentDate: "2024-02-15",
  appointmentTime: "14:30",
  serviceType: "in-home",
  customerEmail: "customer@email.com",
  customerPhone: "+1234567890",
  customerAddress: "123 Main St, City, State",
  totalAmount: 95.00,
  loyaltyPointsUsed: 50
};

const response = await fetch('/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(bookingData)
});
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --testNamePattern="booking"
```

### Test Categories
- **Unit Tests**: Component and hook testing
- **Integration Tests**: API integration testing  
- **E2E Tests**: Full workflow testing

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Set the following for production:
```env
VITE_SPRING_BOOT_URL=https://your-api-domain.com
VITE_EMAILJS_SERVICE_ID=prod_service_id
VITE_EMAILJS_TEMPLATE_ID=prod_template_id
VITE_EMAILJS_PUBLIC_KEY=prod_public_key
```

### Deployment Platforms
- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting with forms
- **AWS S3 + CloudFront**: Scalable hosting solution

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── booking/        # Booking flow components
│   ├── admin/          # Admin dashboard components
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
│   ├── booking/        # Booking-related hooks
│   └── use*.ts         # Utility hooks
├── pages/              # Route components
├── utils/              # Helper functions
├── data/               # Static JSON data
└── contexts/           # React contexts
```

### Adding New Features

1. **Create Component**
```typescript
// src/components/NewFeature.tsx
import React from 'react';

interface NewFeatureProps {
  title: string;
}

export const NewFeature: React.FC<NewFeatureProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

2. **Add Hook (if needed)**
```typescript
// src/hooks/useNewFeature.ts
import { useState, useEffect } from 'react';

export const useNewFeature = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch data logic
  }, []);
  
  return { data };
};
```

3. **Update Routes**
```typescript
// Add to router configuration
<Route path="/new-feature" element={<NewFeature />} />
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Conventional Commits**: Standardized commit messages

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Responsive images with lazy loading
- **Caching**: 30-minute cache for service data
- **Debouncing**: Rate-limited API calls
- **Memoization**: React.memo for expensive components

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   ```bash
   # Check Spring Boot health
   curl http://localhost:8080/api/health
   ```

2. **Email Not Sending**
   - Verify EmailJS configuration
   - Check email template variables
   - Review browser console for errors

3. **Booking Conflicts**
   - Clear localStorage: `localStorage.clear()`
   - Refresh time slot data
   - Check date/time formatting

4. **Build Errors**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Tools
```javascript
// Console commands for debugging
console.log('Current data source:', window.__DEBUG?.dataSource);
localStorage.clear(); // Clear all cached data
window.location.reload(); // Force refresh
```

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines
- Write TypeScript with strict typing
- Include unit tests for new features
- Update documentation for API changes
- Follow existing code patterns
- Test with all backend scenarios (Spring Boot, Supabase, Local)

### Code Review Process
1. Automated tests must pass
2. Code review by maintainer
3. Documentation updates included
4. No breaking changes without major version bump

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Shadcn** for the beautiful component library
- **Supabase** for the backend-as-a-service platform
- **EmailJS** for email integration
- **Unsplash** for beautiful service images

## 📞 Support

### Getting Help
- **Documentation**: Check the [complete documentation](./docs/complete-app-documentation.md)
- **Issues**: Report bugs via [GitHub Issues](https://github.com/your-username/beauty-plaza-online-hub/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/your-username/beauty-plaza-online-hub/discussions)

### Contact Information
- **Email**: support@beautyplaza.com
- **Phone**: (903) 921-0271
- **Address**: 2604 Jacqueline Dr, Wilmington, DE - 19810

---

**Built with ❤️ by the Beauty Plaza Team**
