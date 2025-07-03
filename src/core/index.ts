// Main hook
export { useAdhesionForm } from './useAdhesionForm'
export type {
  UseAdhesionFormOptions,
  UseAdhesionFormReturn,
} from './useAdhesionForm'

// Store
export {
  useFormStore,
  useCurrentStep,
  useFormData,
  useIsSubmitting,
  useFormErrors,
} from './state/formStore'

// Hooks
export { useFormNavigation } from './hooks/useFormNavigation'

// Types
export * from './types'

// Schemas
export * from './schemas/adhesionSchema'

// API
export {
  handleStep1Submission,
  validateSms,
  resendSms,
} from './api/submitAdhesion'
