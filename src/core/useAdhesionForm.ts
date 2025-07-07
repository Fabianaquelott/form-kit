// src/core/useAdhesionForm.ts

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStore } from './state/formStore'
import { useFormNavigation } from './hooks/useFormNavigation'
import { stepSchemas, type AdhesionFormSchema } from './schemas/adhesionSchema'
import {
  handleStep1Submission,
  validateSms,
  getUserByEmail,
  resendSms,
  submitDocuments,
  acceptContract,
} from './api/submitAdhesion'
import type {
  AdhesionFormData,
  CreateContactPayload,
  UrlParams,
  FormErrors,
  AcceptContractPayload,
} from './types'

export interface UseAdhesionFormOptions {
  onStepChange?: (step: number) => void
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
}

export const useAdhesionForm = (options: UseAdhesionFormOptions = {}) => {
  const { onStepChange, onSubmitSuccess, onSubmitError } = options
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

  const [resendCooldown, setResendCooldown] = useState(0)
  const [referralCoupon, setReferralCoupon] = useState<string | null>(null)

  const form = useForm<AdhesionFormSchema>({
    resolver: zodResolver(stepSchemas[currentStep as keyof typeof stepSchemas]),
    defaultValues: formData,
    mode: 'onBlur',
  })

  // Efeito para gerar o cupom de indicação na Etapa 5
  useEffect(() => {
    if (currentStep === 5 && formData.contactId && !referralCoupon) {
      const contactIdNumber = parseInt(formData.contactId, 10)
      if (!isNaN(contactIdNumber)) {
        const calculatedId = contactIdNumber + 16 + 452
        const coupon = `10${calculatedId.toString(16)}`.toUpperCase()
        setReferralCoupon(coupon)
        updateFormData({ referralCoupon: coupon })
      }
    }
  }, [currentStep, formData.contactId, referralCoupon, updateFormData])

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<AdhesionFormData>)
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      )
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  useEffect(() => {
    if (!formData.urlParams || Object.keys(formData.urlParams).length === 0) {
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

  useEffect(() => {
    onStepChange?.(currentStep)
  }, [currentStep, onStepChange])

  const handleApiError = (error: any, step: number) => {
    const errorMessage = error.message || 'Ocorreu um erro inesperado.'
    console.error(`Erro na Etapa ${step}:`, error)
    setErrors({ general: errorMessage })
    onSubmitError?.(errorMessage)
  }

  const handleExistingUser = useCallback(
    async (email: string) => {
      const userResponse = await getUserByEmail(email)

      if (userResponse.success && userResponse.contact) {
        const contact = userResponse.contact
        updateFormData({
          contactId: contact.id,
          dealId: contact.deal?.id,
          name: `${contact.firstname} ${contact.lastname}`,
          email: contact.email,
          contact,
        })

        if (contact.aceite_do_termo_de_adesao === 'true') {
          navigation.goToStep(5)
          return
        }

        if (!contact.deal?.cpf && !contact.deal?.cnpj) {
          navigation.goToStep(3)
          return
        }

        navigation.goToStep(4)
      } else {
        setErrors({
          general:
            userResponse.error ||
            'Não foi possível recuperar os dados do usuário.',
        })
      }
    },
    [updateFormData, navigation, setErrors]
  )

  const submitStep1 = useCallback(
    async (data: Partial<AdhesionFormData>) => {
      setSubmitting(true)
      clearErrors()

      const [firstname, ...lastnameParts] = data.name!.trim().split(' ')
      const lastname = lastnameParts.join(' ')

      const attempt = formData.attempt || 1

      const payload: CreateContactPayload = {
        ...(data as AdhesionFormData),
        firstname,
        lastname,
        urlParams: formData.urlParams || {},
        attempt,
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
          if (result.code === 'user_already_exist') {
            await handleExistingUser(data.email!)
          } else {
            if (result.code === 'did_you_mean_email') {
              updateFormData({ attempt: (formData.attempt || 1) + 1 })
            }
            setErrors({
              general:
                result.error || 'Não foi possível processar sua solicitação.',
            })
            onSubmitError?.(result.error || 'Erro desconhecido na API')
          }
        }
      } catch (error: any) {
        handleApiError(error, 1)
      } finally {
        setSubmitting(false)
      }
    },
    [
      formData.urlParams,
      formData.attempt,
      handleExistingUser,
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
      onSubmitError,
      setErrors,
    ]
  )

  const submitStep3 = useCallback(
    async (data: Partial<AdhesionFormData>) => {
      const documentValue = data.documentType === 'cpf' ? data.cpf : data.cnpj

      if (
        !formData.contactId ||
        !formData.dealId ||
        !formData.name ||
        !data.documentType ||
        !documentValue
      ) {
        setErrors({ general: 'Dados insuficientes para enviar o documento.' })
        return
      }
      setSubmitting(true)
      clearErrors()

      try {
        const payload = {
          contactId: formData.contactId,
          dealId: formData.dealId,
          contactName: formData.name,
          document: {
            type: data.documentType,
            value: documentValue,
          },
        }
        const result = await submitDocuments(payload)

        if (result.success) {
          updateFormData(data)
          navigation.nextStep()
        } else {
          setErrors({
            general: result.error || 'Não foi possível validar seu documento.',
          })
          onSubmitError?.(result.error || 'Erro ao enviar documento.')
        }
      } catch (error: any) {
        handleApiError(error, 3)
      } finally {
        setSubmitting(false)
      }
    },
    [
      formData.contactId,
      formData.dealId,
      formData.name,
      setSubmitting,
      clearErrors,
      updateFormData,
      navigation,
      setErrors,
      onSubmitError,
    ]
  )

  const submitStep4 = useCallback(
    async (data: Partial<AdhesionFormData>) => {
      if (!formData.contactId) {
        setErrors({ general: 'ID do Contato não encontrado.' })
        return
      }
      setSubmitting(true)
      clearErrors()

      try {
        const payload: AcceptContractPayload = {
          contact_id: formData.contactId,
          cupom_indicacao: data.coupon || undefined,
          app: false,
        }

        const result = await acceptContract(payload)

        if (result.success) {
          updateFormData({
            ...data,
            contact: result.contact,
          })
          navigation.nextStep()
          onSubmitSuccess?.(result) // Dispara o sucesso geral ao chegar na última etapa
        } else {
          setErrors({
            general: result.error || 'Não foi possível aceitar o contrato.',
          })
          onSubmitError?.(result.error || 'Erro ao aceitar o contrato.')
        }
      } catch (error: any) {
        handleApiError(error, 4)
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
      setErrors,
      onSubmitSuccess,
      onSubmitError,
    ]
  )

  const handleResendSms = useCallback(async () => {
    if (resendCooldown > 0 || !formData.contactId || !formData.phone) return

    setSubmitting(true)
    const result = await resendSms({
      contactId: formData.contactId,
      phone: formData.phone,
    })
    setSubmitting(false)

    if (result.success) {
      setResendCooldown(60)
    } else {
      setErrors({ general: result.error || 'Falha ao reenviar o código.' })
    }
  }, [
    resendCooldown,
    formData.contactId,
    formData.phone,
    setSubmitting,
    setErrors,
  ])

  const onSubmit = form.handleSubmit(async (data) => {
    switch (currentStep) {
      case 1:
        await submitStep1(data)
        break
      case 2:
        await submitStep2(data)
        break
      case 3:
        await submitStep3(data)
        break
      case 4:
        await submitStep4(data)
        break
      case 5:
        // A etapa 5 é apenas de visualização, não tem submissão.
        // Opcionalmente, pode-se chamar o reset aqui ou em um botão específico.
        console.log('Fluxo finalizado!')
        break
      default:
        console.warn(
          `Etapa ${currentStep} não possui uma ação de envio definida.`
        )
    }
  })

  const combinedErrors: FormErrors = {
    ...form.formState.errors,
    ...storeErrors,
  }

  return {
    form,
    currentStep,
    isSubmitting,
    errors: combinedErrors,
    navigation,
    onSubmit,
    resetForm,
    handleResendSms,
    resendCooldown,
    referralCoupon,
  }
}

export type UseAdhesionFormReturn = ReturnType<typeof useAdhesionForm>
