
import { sanitizeInput, validateEmail, validatePhone, validateName } from './inputValidation';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

export const validateField = (value: any, rules: ValidationRule, fieldName: string): string | null => {
  // Handle required validation
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${fieldName} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && !value.trim())) {
    return null;
  }

  const stringValue = String(value).trim();

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `${fieldName} cannot exceed ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return `${fieldName} format is invalid`;
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (data: any, validationSchema: FieldValidation): ValidationResult => {
  const errors: { [fieldName: string]: string } = {};

  Object.keys(validationSchema).forEach(fieldName => {
    const rules = validationSchema[fieldName];
    const value = data[fieldName];
    const error = validateField(value, rules, fieldName);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation schemas
export const customerInfoValidation: FieldValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: (value) => validateName(value) ? null : 'Name can only contain letters and spaces'
  },
  email: {
    required: true,
    custom: (value) => validateEmail(value) ? null : 'Please enter a valid email address'
  },
  phone: {
    required: true,
    custom: (value) => validatePhone(value) ? null : 'Please enter a valid phone number'
  },
  address: {
    required: false,
    maxLength: 200
  },
  notes: {
    required: false,
    maxLength: 500
  }
};

export const appointmentValidation: FieldValidation = {
  selectedServices: {
    required: true,
    custom: (value) => (Array.isArray(value) && value.length > 0) ? null : 'Please select at least one service'
  },
  selectedTechnician: {
    required: true
  },
  selectedDate: {
    required: true,
    custom: (value) => {
      if (!value) return 'Please select a date';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today ? null : 'Please select a future date';
    }
  },
  selectedTime: {
    required: true
  }
};
