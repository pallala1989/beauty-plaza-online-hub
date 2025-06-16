
# Beauty Plaza - Full Stack Booking Application

This repository contains the code for Beauty Plaza, a full-stack web application for a beauty salon. It includes a React frontend and a Spring Boot backend.

## Quick Start

1. **Frontend**: React + Vite + TypeScript + Tailwind CSS + Shadcn UI
2. **Backend**: Spring Boot + MySQL + OAuth2 Authentication
3. **Features**: Service booking, customer management, admin dashboard, loyalty program

## Project Structure

```
├── src/                    # React frontend application
├── docs/                   # Detailed documentation
├── backend-setup/          # Backend configuration and setup files
└── database/              # Database schema and sample data
```

## Frontend Features

- **Service Browsing**: Browse and filter beauty services
- **Online Booking**: Complete appointment booking flow with date/time selection
- **Authentication**: OAuth-based login with admin panel access
- **User Management**: Customer profiles, booking history, loyalty points
- **Admin Dashboard**: Service management, technician scheduling, settings
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Backend Features

- **RESTful API**: Complete REST API for all frontend operations
- **OAuth2 Security**: Secure authentication and authorization
- **MySQL Database**: Robust data persistence with JPA/Hibernate
- **Admin Panel**: Administrative functions with role-based access
- **Data Fallback**: Graceful fallback to local JSON data when backend unavailable

## Getting Started

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
See [Backend Setup Guide](./docs/backend-setup.md) for detailed instructions.

### Database Setup
See [Database Documentation](./docs/database.md) for MySQL schema and sample data.

## Documentation

- [Backend Setup & Configuration](./docs/backend-setup.md)
- [API Documentation](./docs/api-documentation.md)
- [Database Schema & Queries](./docs/database.md)
- [Authentication & Security](./docs/authentication.md)
- [Deployment Guide](./docs/deployment.md)

## Default Admin Access

- **Username**: `admin`
- **Password**: `admin`
- **Role**: Admin access to dashboard and settings

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data fetching

### Backend
- Spring Boot 3.x
- Spring Security with OAuth2
- Spring Data JPA
- MySQL 8.x
- Maven for dependency management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
