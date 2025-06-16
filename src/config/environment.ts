
export const config = {
  // Backend URLs
  SPRING_BOOT_BASE_URL: import.meta.env.VITE_SPRING_BOOT_URL || 'http://localhost:8080',
  
  // API endpoints
  API_ENDPOINTS: {
    HEALTH: '/api/health',
    SERVICES: '/api/services',
    TECHNICIANS: '/api/technicians',
    APPOINTMENTS: '/api/appointments',
    SETTINGS: '/api/admin/settings',
    BOOK_APPOINTMENT: '/api/appointments/book',
    AVAILABLE_SLOTS: '/api/appointments/slots'
  },
  
  // Request timeouts
  TIMEOUTS: {
    HEALTH_CHECK: 3000,
    API_REQUEST: 10000
  },
  
  // Security settings
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    PASSWORD_MIN_LENGTH: 6
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${config.SPRING_BOOT_BASE_URL}${endpoint}`;
};
