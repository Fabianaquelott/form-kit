// src/core/useAdhesionForm.ts

import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStore } from './state/formStore'
import { useFormNavigation } from './hooks/useFormNavigation'
import { stepSchemas, type AdhesionFormSchema } from './schemas/adhesionSchema'
import {
  handleStep1Submission,
  validateSms,
  resendSms,
} from './api/submitAdhesion'
import type { AdhesionFormData, CreateContactPayload, UrlParams } from './types'

export interface UseAdhesionFormOptions {
  onStepChange?: (step: number) => void
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
}

export const useAdhesionForm = (options: UseAdhesionFormOptions = {}) => {
  const { onSubmitSuccess, onSubmitError } = options
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
  const navigation = useFormNavigation()

  const form = useForm<AdhesionFormSchema>({
    resolver: zodResolver(stepSchemas[currentStep as keyof typeof stepSchemas]),
    defaultValues: formData,
    mode: 'onBlur',
  })

  // Efeito para capturar os parâmetros da URL uma única vez
  useEffect(() => {
    if (Object.keys(formData.urlParams || {}).length === 0) {
      const params = new URLSearchParams(window.location.search)
      const urlParams: UrlParams = {}
      for (const [key, value] of params.entries()) {
        urlParams[key] = value
      }
      if (Object.keys(urlParams).length > 0) {
        updateFormData({ urlParams })
      }
    }
  }, [formData.urlParams, updateFormData])

  const handleApiError = (error: any, step: number) => {
    const errorMessage = error.message || 'Ocorreu um erro inesperado.'
    console.error(`Erro na Etapa ${step}:`, error)
    setErrors({ general: errorMessage })
    onSubmitError?.(errorMessage)
  }

  const submitStep1 = useCallback(
    async (data: Partial<AdhesionFormData>) => {
      setSubmitting(true)
      clearErrors()

      const [firstname, ...lastnameParts] = data.name!.trim().split(' ')
      const lastname = lastnameParts.join(' ')

      const payload: CreateContactPayload = {
        ...(data as AdhesionFormData),
        firstname,
        lastname,
        urlParams: formData.urlParams || {},
        attempt: 1, // Criar funcionalidade de tentativas de envio
      }

      try {
        const result = await handleStep1Submission(payload)

        if (result.success) {
          updateFormData({
            ...data,
            contactId: result.contact_id,
            dealId: result.deal?.deal_id,
          })
          navigation.nextStep()
        } else {
          switch (result.code) {
            case 'user_already_exist':
            case 'cpf_or_cnpj_already_exist':
              setErrors({
                email: 'Este e-mail ou documento já está cadastrado.',
              })
              break
            case 'go_to_whatsapp':
              setErrors({
                general:
                  'Houve um problema. Por favor, entre em contato via WhatsApp.',
              })
              break
            default:
              setErrors({
                general:
                  result.error || 'Não foi possível processar sua solicitação.',
              })
              break
          }
          onSubmitError?.(result.error || 'Erro desconhecido na API')
        }
      } catch (error: any) {
        handleApiError(error, 1)
      } finally {
        setSubmitting(false)
      }
    },
    [
      formData.urlParams,
      setSubmitting,
      clearErrors,
      updateFormData,
      navigation,
      setErrors,
      onSubmitError,
    ]
  )

  const submitStep2 = useCallback(
    async (data: Partial<AdhesionFormData>) => {
      if (!formData.contactId || !data.smsCode) {
        setErrors({ general: 'ID do Contato ou código SMS ausente.' })
        return
      }
      setSubmitting(true)
      clearErrors()
      try {
        const result = await validateSms({
          contactId: formData.contactId,
          smsCode: data.smsCode,
        })
        if (result.success) {
          updateFormData(data)
          navigation.nextStep()
          onSubmitSuccess?.(result)
        } else {
          setErrors({ smsCode: result.error || 'Código SMS inválido.' })
          onSubmitError?.(result.error || 'Código inválido.')
        }
      } catch (error: any) {
        handleApiError(error, 2)
      } finally {
        setSubmitting(false)
      }
    },
    [
      formData.contactId,
      setSubmitting,
      clearErrors,
      updateFormData,
      navigation,
      onSubmitSuccess,
      onSubmitError,
      setErrors,
    ]
  )

  const onSubmit = form.handleSubmit(async (data) => {
    switch (currentStep) {
      case 1:
        await submitStep1(data)
        break
      case 2:
        await submitStep2(data)
        break
      default:
        console.warn(
          `Etapa ${currentStep} não possui uma ação de envio definida.`
        )
    }
  })

  return {
    form,
    currentStep,
    isSubmitting,
    errors: { ...form.formState.errors, ...storeErrors },
    navigation: {
      ...navigation,
      goToNextStep: form.handleSubmit(() => navigation.nextStep()),
    },
    onSubmit,
    resetForm,
  }
}

export type UseAdhesionFormReturn = ReturnType<typeof useAdhesionForm>
