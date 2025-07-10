// src/core/state/formStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AdhesionFormState, AdhesionFormData } from '../types'

interface FormStoreActions {
  setCurrentStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: Partial<AdhesionFormData>) => void
  setSubmitting: (isSubmitting: boolean) => void
  setErrors: (errors: Record<string, string>) => void
  clearErrors: () => void
  resetForm: () => void
}

type FormStore = AdhesionFormState & FormStoreActions

const initialState: AdhesionFormState = {
  currentStep: 1,
  totalSteps: 5,
  data: {
    isEmailConfirmationRequired: false,
  },
  isSubmitting: false,
  errors: {},
}

export const useFormStore = create<FormStore>()(
  devtools(
    (set) => ({
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

      clearErrors: () => set(() => ({ errors: {} }), false, 'clearErrors'),

      setSubmitting: (isSubmitting: boolean) =>
        set(() => ({ isSubmitting }), false, 'setSubmitting'),

      setErrors: (errors: Record<string, string>) =>
        set(() => ({ errors }), false, 'setErrors'),

      resetForm: () => set(() => ({ ...initialState }), false, 'resetForm'),
    }),
    {
      name: 'adhesion-form-store',
    }
  )
)

export const useCurrentStep = () => useFormStore((state) => state.currentStep)
export const useFormData = () => useFormStore((state) => state.data)
export const useIsSubmitting = () => useFormStore((state) => state.isSubmitting)
export const useFormErrors = () => useFormStore((state) => state.errors)
