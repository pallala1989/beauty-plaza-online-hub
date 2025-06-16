
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any, context: string): string => {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error.name === 'AbortError') {
    return 'Request timed out. Please try again.';
  }
  
  if (error.message?.includes('fetch')) {
    return 'Unable to connect to server. Please check your connection.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const sanitizeErrorMessage = (message: string): string => {
  // Remove any potentially sensitive information from error messages
  return message
    .replace(/password/gi, '***')
    .replace(/token/gi, '***')
    .replace(/key/gi, '***')
    .replace(/secret/gi, '***');
};
