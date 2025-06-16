
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitizedEmail = sanitizeInput(email);
  return emailRegex.test(sanitizedEmail) && sanitizedEmail.length <= 254;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  const sanitizedPhone = sanitizeInput(phone);
  return phoneRegex.test(sanitizedPhone);
};

export const validateName = (name: string): boolean => {
  const sanitizedName = sanitizeInput(name);
  return sanitizedName.length >= 2 && sanitizedName.length <= 50 && /^[a-zA-Z\s]+$/.test(sanitizedName);
};

export const sanitizeNotes = (notes: string): string => {
  return DOMPurify.sanitize(notes.trim(), { 
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: []
  });
};
