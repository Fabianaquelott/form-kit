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
  uploadBillFile,
  acceptContract,
} from './api/submitAdhesion'
import type {
  AdhesionFormData,
  CreateContactPayload,
  UrlParams,
  FormErrors,
  AcceptContractPayload,
  FlowConfig,
} from './types'

const getCookiesAsString = (): string => {
  if (typeof document === 'undefined') return '{}'
  const cookies = document.cookie.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split('=').map((c) => c.trim())
      if (key && value) {
        acc[key] = decodeURIComponent(value)
      }
      return acc
    },
    {} as { [key: string]: string }
  )
  return JSON.stringify(cookies)
}

export interface UseAdhesionFormOptions {
  flowConfig?: FlowConfig
  onStepChange?: (step: number) => void
  onSubmitSuccess?: (data: any) => void
  onSubmitError?: (error: string) => void
}

export const useAdhesionForm = (options: UseAdhesionFormOptions = {}) => {
  const { flowConfig, onStepChange, onSubmitSuccess, onSubmitError } = options
  const {
    currentStep,
    data: formDataFromStore,
    isSubmitting,
    errors: storeErrors,
    updateFormData,
    setSubmitting,
    setErrors,
    clearErrors,
    resetForm,
    setSteps,
  } = useFormStore()
  const navigation = useFormNavigation()

  useEffect(() => {
    if (flowConfig) {
      setSteps(flowConfig.steps)
    }
  }, [flowConfig, setSteps])

  const [resendCooldown, setResendCooldown] = useState(0)

  const form = useForm<AdhesionFormSchema>({
    resolver: zodResolver(stepSchemas[currentStep as keyof typeof stepSchemas]),
    defaultValues: formDataFromStore,
    mode: 'onBlur',
  })

  useEffect(() => {
    const subscription = form.watch((value: Partial<AdhesionFormData>) => {
      updateFormData(value)
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
    if (
      !formDataFromStore.urlParams ||
      Object.keys(formDataFromStore.urlParams).length === 0
    ) {
      const params = new URLSearchParams(window.location.search)
      const urlParams: UrlParams = {}
      for (const [key, value] of params.entries()) {
        if (key.startsWith('utm_') || key.startsWith('hs_')) {
          urlParams[key] = value
        }
      }
      if (Object.keys(urlParams).length > 0) {
        updateFormData({ urlParams })
      }
    }
  }, [formDataFromStore.urlParams, updateFormData])

  useEffect(() => {
    onStepChange?.(currentStep)
  }, [currentStep, onStepChange])

  let referralCoupon: string | null = null
  if (currentStep === 5 && formDataFromStore.contactId) {
    const contactIdNumber = parseInt(formDataFromStore.contactId, 10)
    if (!isNaN(contactIdNumber)) {
      const calculatedId = contactIdNumber + 16 + 452
      referralCoupon = `10${calculatedId.toString(16)}`.toUpperCase()
    }
  }

  useEffect(() => {
    if (referralCoupon && formDataFromStore.referralCoupon !== referralCoupon) {
      updateFormData({ referralCoupon })
    }
  }, [referralCoupon, formDataFromStore.referralCoupon, updateFormData])
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
        } else if (!contact.deal?.cpf && !contact.deal?.cnpj) {
          navigation.goToStep(3)
        } else {
          navigation.goToStep(4)
        }
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
      const currentState = useFormStore.getState().data
      setSubmitting(true)
      clearErrors()

      if (currentState.isEmailConfirmationRequired) {
        updateFormData({
          isEmailConfirmationRequired: false,
          emailConfirmed: false,
        })
      }

      const [firstname, ...lastnameParts] = data.name!.trim().split(' ')
      const lastname = lastnameParts.join(' ')
      const attempt = currentState.attempt || 1
      const urlParams = currentState.urlParams || {}

      const payload: CreateContactPayload = {
        firstname,
        lastname,
        deal_name: data.name!,
        email: data.email!,
        phone: `+55${data.phone!.replace(/\D/g, '')}`,
        attempt,
        cookies: getCookiesAsString(),
        utm_campaign: urlParams.utm_campaign || '',
        utm_content: urlParams.utm_content || '',
        utm_medium: urlParams.utm_medium || '',
        utm_source: urlParams.utm_source || '',
        utm_term: urlParams.utm_term || '',
        hs_facebook_click_id: urlParams.hs_facebook_click_id || '',
        hs_google_click_id: urlParams.hs_google_click_id || '',
        pf_calculadora__mgm___contactid_de_quem_indicou: '',
        interClickRef: '',
      }

      try {
        const result = await handleStep1Submission(payload)
        if (result.success) {
          updateFormData({
            ...data,
            contactId: result.contact_id,
            dealId: result.deal?.deal_id,
            attempt: 1,
          })
          navigation.nextStep()
        } else {
          if (result.code === 'user_already_exist') {
            await handleExistingUser(data.email!)
          } else if (
            result.code === 'confirm_email' ||
            result.code === 'did_you_mean_email'
          ) {
            updateFormData({
              isEmailConfirmationRequired: true,
              attempt: attempt + 1,
            })
            const errorMessage =
              result.info || 'Confirme se seu e-mail está correto.'
            setErrors({ email: errorMessage })
            onSubmitError?.(errorMessage)
          } else {
            setErrors({
              general:
                result.error || 'Não foi possível processar sua solicitação.',
            })
            onSubmitError?.(result.error || 'Erro desconhecido')
          }
        }
      } catch (error: any) {
        handleApiError(error, 1)
      } finally {
        setSubmitting(false)
      }
    },
    [
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
      const currentState = useFormStore.getState().data
      if (!currentState.contactId || !data.smsCode) {
        setErrors({ general: 'ID do Contato ou código SMS ausente.' })
        return
      }
      setSubmitting(true)
      clearErrors()
      try {
        const result = await validateSms({
          contactId: currentState.contactId,
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
      setSubmitting,
      clearErrors,
      updateFormData,
      navigation,
      setErrors,
      onSubmitError,
    ]
  )

  const submitStep3 = useCallback(
    async (data: Partial<AdhesionFormData>) => {
      const currentState = useFormStore.getState().data
      setSubmitting(true)
      clearErrors()
      try {
        if (
          data.documentType === 'cpf' &&
          data.isBillOwner === false &&
          data.dontKnowBillOwnerCpf
        ) {
          if (!currentState.dealId) {
            setErrors({
              general: 'ID do Negócio não encontrado para o upload.',
            })
          } else if (data.billFile?.[0]) {
            const uploadResult = await uploadBillFile({
              dealId: currentState.dealId,
              file: data.billFile[0],
            })
            if (uploadResult.success) {
              updateFormData(data)
              navigation.nextStep()
            } else {
              setErrors({
                general: uploadResult.error || 'Falha no upload do arquivo.',
              })
            }
          }
          return
        }

        const documentValue =
          data.documentType === 'cpf'
            ? data.isBillOwner
              ? data.myCpf
              : data.billOwnerCpf
            : data.cnpj

        if (
          !currentState.contactId ||
          !currentState.dealId ||
          !currentState.name ||
          !data.documentType ||
          !documentValue
        ) {
          setErrors({ general: 'Dados insuficientes para enviar o documento.' })
          return
        }

        const payload = {
          contactId: currentState.contactId,
          dealId: currentState.dealId,
          contactName: currentState.name,
          document: { type: data.documentType, value: documentValue },
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
      const currentState = useFormStore.getState().data
      if (!currentState.contactId) {
        setErrors({ general: 'ID do Contato não encontrado.' })
        return
      }
      setSubmitting(true)
      clearErrors()
      try {
        const payload: AcceptContractPayload = {
          contact_id: currentState.contactId,
          cupom_indicacao: data.coupon || undefined,
          app: false,
        }
        const result = await acceptContract(payload)
        if (result.success) {
          updateFormData({ ...data, contact: result.contact })
          navigation.nextStep()
          onSubmitSuccess?.(result)
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
    const currentState = useFormStore.getState().data
    if (resendCooldown > 0 || !currentState.contactId || !currentState.phone)
      return
    setSubmitting(true)
    const result = await resendSms({
      contactId: currentState.contactId,
      phone: currentState.phone,
    })
    setSubmitting(false)
    if (result.success) {
      setResendCooldown(60)
    } else {
      setErrors({ general: result.error || 'Falha ao reenviar o código.' })
    }
  }, [resendCooldown, setSubmitting, setErrors])

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
