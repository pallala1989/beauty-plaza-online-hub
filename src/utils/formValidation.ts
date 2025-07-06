
export interface FieldValidation {
  [fieldName: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    phone?: boolean;
    custom?: (value: any) => string | null;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

export const validateForm = (values: Record<string, any>, schema: FieldValidation): ValidationResult => {
  const errors: { [fieldName: string]: string } = {};

  Object.keys(schema).forEach(fieldName => {
    const fieldSchema = schema[fieldName];
    const value = values[fieldName];

    // Required validation
    if (fieldSchema.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[fieldName] = `${fieldName} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return;
    }

    const stringValue = String(value);

    // Min length validation
    if (fieldSchema.minLength && stringValue.length < fieldSchema.minLength) {
      errors[fieldName] = `${fieldName} must be at least ${fieldSchema.minLength} characters`;
      return;
    }

    // Max length validation
    if (fieldSchema.maxLength && stringValue.length > fieldSchema.maxLength) {
      errors[fieldName] = `${fieldName} must be no more than ${fieldSchema.maxLength} characters`;
      return;
    }

    // Email validation
    if (fieldSchema.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(stringValue)) {
        errors[fieldName] = 'Please enter a valid email address';
        return;
      }
    }

    // Phone validation
    if (fieldSchema.phone) {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = stringValue.replace(/[\s\-\(\)]/g, '');
      if (!phonePattern.test(cleanPhone)) {
        errors[fieldName] = 'Please enter a valid phone number';
        return;
      }
    }

    // Pattern validation
    if (fieldSchema.pattern && !fieldSchema.pattern.test(stringValue)) {
      errors[fieldName] = `${fieldName} format is invalid`;
      return;
    }

    // Custom validation
    if (fieldSchema.custom) {
      const customError = fieldSchema.custom(value);
      if (customError) {
        errors[fieldName] = customError;
        return;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation schemas
export const commonSchemas = {
  email: {
    required: true,
    email: true
  },
  phone: {
    required: true,
    phone: true
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  }
};
