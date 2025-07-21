// src/core/state/formStore.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AdhesionFormState, AdhesionFormData, FlowStep } from '../types'

interface FormStoreActions {
  setCurrentStep: (step: FlowStep) => void
  setSteps: (steps: FlowStep[]) => void
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
  steps: [1, 2, 3, 4, 5],
  data: {
    isEmailConfirmationRequired: false,
  },
  isSubmitting: false,
  errors: {},
}

export const useFormStore = create<FormStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setSteps: (steps: FlowStep[]) =>
        set({ steps, totalSteps: steps.length, currentStep: steps[0] || 1 }),

      setCurrentStep: (step: FlowStep) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep, steps } = get()
        const currentIndex = steps.indexOf(currentStep)
        if (currentIndex < steps.length - 1) {
          set({ currentStep: steps[currentIndex + 1] })
        }
      },

      previousStep: () => {
        const { currentStep, steps } = get()
        const currentIndex = steps.indexOf(currentStep)
        if (currentIndex > 0) {
          set({ currentStep: steps[currentIndex - 1] })
        }
      },

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
    { name: 'adhesion-form-store' }
  )
)

export const useCurrentStep = () => useFormStore((state) => state.currentStep)
export const useFormData = () => useFormStore((state) => state.data)
export const useIsSubmitting = () => useFormStore((state) => state.isSubmitting)
export const useFormErrors = () => useFormStore((state) => state.errors)
