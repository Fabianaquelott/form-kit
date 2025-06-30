import { useMemo } from 'react'

import type { FormNavigationState } from '../types'
import { useFormStore } from '../state/formStore'

export const useFormNavigation = (): FormNavigationState & {
  goToStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
} => {
  const { currentStep, totalSteps, nextStep, previousStep, setCurrentStep } = useFormStore()
  
  const navigationState = useMemo((): FormNavigationState => ({
    canGoNext: currentStep < totalSteps,
    canGoPrevious: currentStep > 1,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  }), [currentStep, totalSteps])
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }
  
  return {
    ...navigationState,
    goToStep,
    nextStep,
    previousStep,
  }
}