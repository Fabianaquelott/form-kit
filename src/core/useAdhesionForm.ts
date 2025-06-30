import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useFormStore } from './state/formStore'
import { useFormNavigation } from './hooks/useFormNavigation'
import { stepSchemas, type AdhesionFormSchema } from './schemas/adhesionSchema'
import { createContact, validateSms, submitAdhesion } from './api/submitAdhesion'
import type { AdhesionFormData } from './types'

export interface UseAdhesionFormOptions {
  onStepChange?: (step: number) => void
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
  validateOnBlur?: boolean
  validateOnChange?: boolean
}

export const useAdhesionForm = (options: UseAdhesionFormOptions = {}) => {
  const {
    onStepChange,
    onSubmitSuccess,
    onSubmitError,
    validateOnBlur = true,
    validateOnChange = false,
  } = options
  
  // Store state
  const {
    currentStep,
    data: formData,
    isSubmitting,
    errors: storeErrors,
    updateFormData,
    setSubmitting,
    setErrors,
    clearErrors,
    resetForm,
  } = useFormStore()
  
  // Navigation
  const navigation = useFormNavigation()
  
  // React Hook Form setup
  const form = useForm<AdhesionFormSchema>({
    resolver: zodResolver(stepSchemas[currentStep as keyof typeof stepSchemas]),
    defaultValues: formData,
    mode: validateOnChange ? 'onChange' : validateOnBlur ? 'onBlur' : 'onSubmit',
  })
  
  const { handleSubmit, reset, formState: { errors: formErrors, isValid } } = form
  
  // Sync form data with store
  useEffect(() => {
    reset(formData)
  }, [formData, reset])
  
  // Notify step changes
  useEffect(() => {
    onStepChange?.(currentStep)
  }, [currentStep, onStepChange])
  
  // Handle step navigation with validation
  const goToNextStep = useCallback(async () => {
    if (!navigation.canGoNext) return false
    
    // Validate current step before proceeding
    const isStepValid = await form.trigger()
    if (!isStepValid) return false
    
    const currentData = form.getValues()
    updateFormData(currentData)
    clearErrors()
    
    navigation.nextStep()
    return true
  }, [navigation, form, updateFormData, clearErrors])
  
  const goToPreviousStep = useCallback(() => {
    if (!navigation.canGoPrevious) return false
    
    const currentData = form.getValues()
    updateFormData(currentData)
    
    navigation.previousStep()
    return true
  }, [navigation, form, updateFormData])
  
  const goToStep = useCallback((step: number) => {
    const currentData = form.getValues()
    updateFormData(currentData)
    
    navigation.goToStep(step)
  }, [navigation, form, updateFormData])
  
  // Submit handlers for each step
  const submitStep1 = useCallback(async (data: Partial<AdhesionFormData>) => {
    setSubmitting(true)
    clearErrors()
    
    try {
      const result = await createContact({
        name: data.name!,
        email: data.email!,
        phone: data.phone!,
      })
      
      if (result.success) {
        updateFormData({ ...data, contactId: result.data?.contactId })
        navigation.nextStep()
      } else {
        setErrors({ general: result.error || 'Erro ao criar contato' })
        onSubmitError?.(result.error || 'Erro ao criar contato')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado'
      setErrors({ general: errorMessage })
      onSubmitError?.(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }, [setSubmitting, clearErrors, updateFormData, navigation, setErrors, onSubmitError])
  
  const submitStep2 = useCallback(async (data: Partial<AdhesionFormData>) => {
    if (!formData.contactId) {
      setErrors({ general: 'ID do contato não encontrado' })
      return
    }
    
    setSubmitting(true)
    clearErrors()
    
    try {
      const result = await validateSms({
        contactId: formData.contactId,
        smsCode: data.smsCode!,
      })
      
      if (result.success && result.data?.isValid) {
        updateFormData(data)
        navigation.nextStep()
      } else {
        setErrors({ smsCode: 'Código SMS inválido' })
        onSubmitError?.('Código SMS inválido')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado'
      setErrors({ general: errorMessage })
      onSubmitError?.(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }, [formData.contactId, setSubmitting, clearErrors, updateFormData, navigation, setErrors, onSubmitError])
  
  const submitFinalStep = useCallback(async (data: AdhesionFormData) => {
    setSubmitting(true)
    clearErrors()
    
    try {
      const completeData = { ...formData, ...data } as AdhesionFormData
      const result = await submitAdhesion(completeData)
      
      if (result.success) {
        onSubmitSuccess?.(result.data)
      } else {
        setErrors({ general: result.error || 'Erro ao finalizar adesão' })
        onSubmitError?.(result.error || 'Erro ao finalizar adesão')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado'
      setErrors({ general: errorMessage })
      onSubmitError?.(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }, [formData, setSubmitting, clearErrors, onSubmitSuccess, onSubmitError, setErrors])
  
  // Main submit handler
  const onSubmit = handleSubmit(async (data) => {
    const completeData = { ...formData, ...data }
    
    switch (currentStep) {
      case 1:
        await submitStep1(completeData)
        break
      case 2:
        await submitStep2(completeData)
        break
      case 3:
        await submitFinalStep(completeData as AdhesionFormData)
        break
      default:
        console.warn(`Etapa ${currentStep} não implementada`)
    }
  })
  
  return {
    // Form instance
    form,
    
    // Current state
    currentStep,
    formData,
    isSubmitting,
    errors: { ...formErrors, ...storeErrors },
    isValid,
    
    // Navigation
    navigation: {
      ...navigation,
      goToNextStep,
      goToPreviousStep,
      goToStep,
    },
    
    // Actions
    onSubmit,
    updateFormData,
    resetForm,
    
    // Step-specific helpers
    canProceed: isValid && !isSubmitting,
    currentStepSchema: stepSchemas[currentStep as keyof typeof stepSchemas],
  }
}

export type UseAdhesionFormReturn = ReturnType<typeof useAdhesionForm>