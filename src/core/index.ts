// Main hook
export { useAdhesionForm } from './useAdhesionForm'
export type { UseAdhesionFormOptions, UseAdhesionFormReturn } from './useAdhesionForm'

// Store
export { useFormStore, useCurrentStep, useFormData, useIsSubmitting, useFormErrors } from './state/formStore'

// Hooks
export { useFormNavigation } from './hooks/useFormNavigation'

// Types
export type {
  AdhesionFormData,
  AdhesionFormState,
  FormNavigationState,
  ApiResponse,
} from './types'

// Schemas
export {
  personalDataSchema,
  smsValidationSchema,
  adhesionFormSchema,
  stepSchemas,
} from './schemas/adhesionSchema'
export type {
  PersonalDataForm,
  SmsValidationForm,
  AdhesionFormSchema,
  StepNumber,
} from './schemas/adhesionSchema'

// API
export {
  createContact,
  validateSms,
  submitAdhesion,
  resendSms,
} from './api/submitAdhesion'