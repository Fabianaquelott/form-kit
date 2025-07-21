// src/core/hooks/useFormNavigation.ts

import { useMemo } from 'react'
import type { FormNavigationState, FlowStep } from '../types'
import { useFormStore } from '../state/formStore'

export const useFormNavigation = (): FormNavigationState & {
  goToStep: (step: FlowStep) => void
  nextStep: () => void
  previousStep: () => void
} => {
  const { currentStep, steps, nextStep, previousStep, setCurrentStep } =
    useFormStore()

  const navigationState = useMemo((): FormNavigationState => {
    const totalStepsInFlow = steps.length
    const currentStepIndexInFlow = steps.indexOf(currentStep)

    return {
      currentStepIndex: currentStepIndexInFlow,
      totalSteps: totalStepsInFlow,
      canGoNext: currentStepIndexInFlow < totalStepsInFlow - 1,
      canGoPrevious: currentStepIndexInFlow > 0,
      isFirstStep: currentStepIndexInFlow === 0,
      isLastStep: currentStepIndexInFlow === totalStepsInFlow - 1,
    }
  }, [currentStep, steps])

  const goToStep = (step: FlowStep) => {
    if (steps.includes(step)) {
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
