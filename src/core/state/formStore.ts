import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { AdhesionFormState, AdhesionFormData } from '../types'

interface FormStoreActions {
  // Navegação
  setCurrentStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  
  // Dados do formulário
  updateFormData: (data: Partial<AdhesionFormData>) => void
  clearFormData: () => void
  
  // Estado de submissão
  setSubmitting: (isSubmitting: boolean) => void
  
  // Erros
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void
  
  // Reset completo
  resetForm: () => void
}

type FormStore = AdhesionFormState & FormStoreActions

const initialState: AdhesionFormState = {
  currentStep: 1,
  totalSteps: 3,
  data: {},
  isSubmitting: false,
  errors: {},
}

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setCurrentStep: (step: number) =>
        set(
          (state) => ({
            currentStep: Math.max(1, Math.min(step, state.totalSteps)),
          }),
          false,
          'setCurrentStep'
        ),
      
      nextStep: () =>
        set(
          (state) => ({
            currentStep: Math.min(state.currentStep + 1, state.totalSteps),
          }),
          false,
          'nextStep'
        ),
      
      previousStep: () =>
        set(
          (state) => ({
            currentStep: Math.max(state.currentStep - 1, 1),
          }),
          false,
          'previousStep'
        ),
      
      updateFormData: (newData: Partial<AdhesionFormData>) =>
        set(
          (state) => ({
            data: { ...state.data, ...newData },
          }),
          false,
          'updateFormData'
        ),
      
      clearFormData: () =>
        set(
          () => ({ data: {} }),
          false,
          'clearFormData'
        ),
      
      setSubmitting: (isSubmitting: boolean) =>
        set(
          () => ({ isSubmitting }),
          false,
          'setSubmitting'
        ),
      
      setErrors: (errors: Record<string, string>) =>
        set(
          () => ({ errors }),
          false,
          'setErrors'
        ),
      
      clearErrors: () =>
        set(
          () => ({ errors: {} }),
          false,
          'clearErrors'
        ),
      
      resetForm: () =>
        set(
          () => ({ ...initialState }),
          false,
          'resetForm'
        ),
    }),
    {
      name: 'adhesion-form-store',
    }
  )
)

// Seletores para facilitar o uso
export const useCurrentStep = () => useFormStore((state) => state.currentStep)
export const useFormData = () => useFormStore((state) => state.data)
export const useIsSubmitting = () => useFormStore((state) => state.isSubmitting)
export const useFormErrors = () => useFormStore((state) => state.errors)