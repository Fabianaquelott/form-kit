// src/core/index.ts

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
export type { FormStore } from './state/formStore'

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
  getUserByEmail,
  resendSms,
  submitDocuments,
  uploadBillFile,
  acceptContract,
} from './api/submitAdhesion'
