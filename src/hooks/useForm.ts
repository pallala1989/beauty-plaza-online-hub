
import { useState, useCallback, useMemo } from 'react';
import { validateForm, FieldValidation, ValidationResult } from '@/utils/formValidation';
import { sanitizeInput } from '@/utils/inputValidation';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: FieldValidation;
  onSubmit?: (values: T) => void | Promise<void>;
  sanitizeInputs?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  validate: () => ValidationResult;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  sanitizeInputs = true
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const isValid = useMemo(() => {
    if (!validationSchema) return Object.keys(errors).length === 0;
    const validation = validateForm(values, validationSchema);
    return validation.isValid && Object.keys(errors).length === 0;
  }, [values, errors, validationSchema]);

  const setValue = useCallback((field: keyof T, value: any) => {
    const processedValue = (sanitizeInputs && typeof value === 'string') 
      ? sanitizeInput(value) 
      : value;
    
    setValuesState(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear error when value changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors, sanitizeInputs]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValue(field, value);
  }, [setValue]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field on blur if schema exists
    if (validationSchema && validationSchema[field as string]) {
      const validation = validateForm({ [field]: values[field] }, { [field as string]: validationSchema[field as string] });
      if (validation.errors[field as string]) {
        setError(field, validation.errors[field as string]);
      }
    }
  }, [validationSchema, values, setError]);

  const validate = useCallback(() => {
    if (!validationSchema) {
      return { isValid: true, errors: {} };
    }
    
    const validation = validateForm(values, validationSchema);
    setErrors(validation.errors as { [K in keyof T]?: string });
    return validation;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);
    
    try {
      // Validate form
      const validation = validate();
      
      if (!validation.isValid) {
        // Mark all fields as touched to show validation errors
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as { [K in keyof T]?: boolean });
        setTouched(allTouched);
        return;
      }

      // Submit form
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate
  };
};
