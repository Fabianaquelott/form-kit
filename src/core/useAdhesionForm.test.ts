// src/core/useAdhesionForm.test.ts

import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFormStore } from './state/formStore'
import { useAdhesionForm } from './useAdhesionForm'
import * as api from './api/submitAdhesion'
import { FlowStep } from './types'

vi.mock('./api/submitAdhesion')

const NEW_USER_DATA = {
  name: 'Novo Usuário Teste Completo',
  email: 'completo@teste.com',
  phone: '(11) 91111-2222',
  termsAccepted: true,
}

const SMS_DATA = { smsCode: '123456' }
const DOCUMENT_DATA = {
  documentType: 'cpf' as const,
  myCpf: '123.456.789-09',
  isBillOwner: true,
}
const CONTRACT_DATA = { termsAcceptedStep4: true }

const EXISTING_USER_DATA = {
  name: 'Usuário Existente Teste',
  email: 'existente@teste.com',
  phone: '(22) 98888-7777',
  termsAccepted: true,
}

const INVALID_FORM_DATA = {
  name: 'Usuário',
  email: 'email-invalido',
  phone: '12345',
  termsAccepted: false,
}

const LANDLINE_USER_DATA = {
  name: 'Usuário Telefone Fixo',
  email: 'fixo@teste.com',
  phone: '(31) 3222-4444',
  termsAccepted: true,
}

describe('useAdhesionForm Hook', () => {
  beforeEach(() => {
    act(() => {
      useFormStore.getState().resetForm()
    })
    vi.clearAllMocks()
  })

  // --- Teste de Fluxo Principal ---
  it('deve navegar com sucesso por todas as 5 etapas para um novo usuário', async () => {
    vi.mocked(api.handleStep1Submission).mockResolvedValue({
      success: true,
      contact_id: '12345',
      deal: { deal_id: 'deal-id-456' },
    })
    vi.mocked(api.validateSms).mockResolvedValue({ success: true })
    vi.mocked(api.submitDocuments).mockResolvedValue({ success: true })
    vi.mocked(api.acceptContract).mockResolvedValue({
      success: true,
      contact: { id: '12345' },
    })

    const { result } = renderHook(() => useAdhesionForm())

    await act(async () => {
      result.current.form.reset(NEW_USER_DATA)
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(2))

    await act(async () => {
      result.current.form.reset({
        ...useFormStore.getState().data,
        ...SMS_DATA,
      })
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(3))

    await act(async () => {
      result.current.form.reset({
        ...useFormStore.getState().data,
        ...DOCUMENT_DATA,
      })
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(4))

    await act(async () => {
      result.current.form.reset({
        ...useFormStore.getState().data,
        ...CONTRACT_DATA,
      })
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(5))

    await waitFor(() => {
      expect(result.current.referralCoupon).not.toBeNull()
      expect(result.current.referralCoupon).toBe('10320D')
    })
  })

  // --- Testes de Cenários de Erro e Validação ---
  it('não deve chamar a API se a validação do formulário falhar', async () => {
    const { result } = renderHook(() => useAdhesionForm())

    await act(async () => {
      result.current.form.reset(INVALID_FORM_DATA)
      await result.current.onSubmit()
    })

    expect(api.handleStep1Submission).not.toHaveBeenCalled()
    expect(result.current.currentStep).toBe(1)
    expect(result.current.errors.name?.message).toBeDefined()
  })

  it('deve rejeitar um número de telefone fixo e mostrar erro', async () => {
    const { result } = renderHook(() => useAdhesionForm())

    await act(async () => {
      result.current.form.reset(LANDLINE_USER_DATA)
      await result.current.onSubmit()
    })

    expect(api.handleStep1Submission).not.toHaveBeenCalled()
    expect(result.current.currentStep).toBe(1)
    expect(result.current.errors.phone?.message).toContain(
      'Formato de celular inválido'
    )
  })

  it('deve lidar com falha na API na Etapa 1', async () => {
    vi.mocked(api.handleStep1Submission).mockRejectedValue(
      new Error('Falha no servidor')
    )
    const { result } = renderHook(() => useAdhesionForm())

    await act(async () => {
      result.current.form.reset(NEW_USER_DATA)
      await result.current.onSubmit()
    })

    await waitFor(() => {
      expect(result.current.currentStep).toBe(1)
      expect(result.current.errors.general).toBe('Falha no servidor')
    })
  })

  it('deve lidar com falha na API na Etapa 3 (documentos) e permanecer na mesma etapa', async () => {
    act(() => {
      useFormStore.setState({
        currentStep: 3,
        data: { contactId: '123', dealId: '456', name: 'Teste' },
      })
    })
    vi.mocked(api.submitDocuments).mockResolvedValue({
      success: false,
      error: 'Documento inválido pela API',
    })

    const { result } = renderHook(() => useAdhesionForm())

    await act(async () => {
      result.current.form.reset({
        ...useFormStore.getState().data,
        ...DOCUMENT_DATA,
      })
      await result.current.onSubmit()
    })

    await waitFor(() => {
      expect(result.current.currentStep).toBe(3)
      expect(result.current.errors.general).toBe('Documento inválido pela API')
    })
  })

  // --- Testes de Fluxos de Usuário Existente ---
  describe('Fluxo de Usuário Existente', () => {
    it('deve navegar para a Etapa 3 se o deal estiver incompleto', async () => {
      vi.mocked(api.handleStep1Submission).mockResolvedValue({
        success: false,
        code: 'user_already_exist',
      })
      vi.mocked(api.getUserByEmail).mockResolvedValue({
        success: true,
        contact: { id: 'e-id-1', deal: { id: 'd-id-1', cpf: null } },
      })
      const { result } = renderHook(() => useAdhesionForm())

      await act(async () => {
        result.current.form.reset(EXISTING_USER_DATA)
        await result.current.onSubmit()
      })

      await waitFor(() => expect(result.current.currentStep).toBe(3))
    })

    it('deve navegar para a Etapa 4 se o deal estiver completo mas o termo não foi aceito', async () => {
      vi.mocked(api.handleStep1Submission).mockResolvedValue({
        success: false,
        code: 'user_already_exist',
      })
      vi.mocked(api.getUserByEmail).mockResolvedValue({
        success: true,
        contact: {
          id: 'e-id-2',
          deal: { id: 'd-id-2', cpf: '11122233344' },
          aceite_do_termo_de_adesao: 'false',
        },
      })
      const { result } = renderHook(() => useAdhesionForm())

      await act(async () => {
        result.current.form.reset(EXISTING_USER_DATA)
        await result.current.onSubmit()
      })

      await waitFor(() => expect(result.current.currentStep).toBe(4))
    })

    it('deve navegar para a Etapa 5 se o usuário já completou todo o fluxo', async () => {
      vi.mocked(api.handleStep1Submission).mockResolvedValue({
        success: false,
        code: 'user_already_exist',
      })
      vi.mocked(api.getUserByEmail).mockResolvedValue({
        success: true,
        contact: {
          id: 'e-id-3',
          deal: { id: 'd-id-3', cpf: '11122233344' },
          aceite_do_termo_de_adesao: 'true',
        },
      })
      const { result } = renderHook(() => useAdhesionForm())

      await act(async () => {
        result.current.form.reset(EXISTING_USER_DATA)
        await result.current.onSubmit()
      })

      await waitFor(() => expect(result.current.currentStep).toBe(5))
    })
  })

  // --- Testes de Funcionalidades Específicas ---
  describe('Funcionalidades Específicas', () => {
    it('deve lidar com o reenvio de SMS e ativar o cooldown', async () => {
      act(() => {
        useFormStore.setState({
          currentStep: 2,
          data: { contactId: 'c-resend', phone: '31988887777' },
        })
      })
      vi.mocked(api.resendSms).mockResolvedValue({ success: true })
      const { result } = renderHook(() => useAdhesionForm())

      expect(result.current.resendCooldown).toBe(0)

      await act(async () => {
        await result.current.handleResendSms()
      })

      expect(api.resendSms).toHaveBeenCalledWith({
        contactId: 'c-resend',
        phone: '31988887777',
      })
      expect(result.current.resendCooldown).toBe(60)
    })

    it('deve mostrar erro se o reenvio de SMS falhar', async () => {
      act(() => {
        useFormStore.setState({
          currentStep: 2,
          data: { contactId: 'c-resend-fail', phone: '31988887777' },
        })
      })
      vi.mocked(api.resendSms).mockResolvedValue({
        success: false,
        error: 'Limite de reenvios atingido',
      })
      const { result } = renderHook(() => useAdhesionForm())

      await act(async () => {
        await result.current.handleResendSms()
      })

      expect(result.current.errors.general).toBe('Limite de reenvios atingido')
      expect(result.current.resendCooldown).toBe(0)
    })
  })
})

// ==================================================================
// --- SUÍTE DE TESTES PARA VALIDAÇÃO DE PAYLOADS E FLUXOS ---
// ==================================================================
describe('Validação de Payloads e Fluxos da API', () => {
  beforeEach(() => {
    act(() => {
      useFormStore.getState().resetForm()
    })
    vi.clearAllMocks()

    Object.defineProperty(document, 'cookie', {
      writable: true,
      value:
        '_ga=GA1.1.2118071165.1750798754; _ga_XDN3ECHJXG=GS2.1.s1752604455',
    })
  })

  it('deve montar e enviar o payload correto para handleStep1Submission (create-contact/deal)', async () => {
    vi.mocked(api.handleStep1Submission).mockResolvedValue({
      success: true,
      contact_id: 'contact-123',
      deal: { deal_id: 'deal-456' },
    })
    const { result } = renderHook(() => useAdhesionForm())

    await act(async () => {
      result.current.form.reset(NEW_USER_DATA)
      await result.current.onSubmit()
    })

    await waitFor(() => {
      expect(api.handleStep1Submission).toHaveBeenCalledTimes(1)
      const actualPayload = vi.mocked(api.handleStep1Submission).mock
        .calls[0][0]
      expect(actualPayload.firstname).toBe('Novo')
      expect(actualPayload.lastname).toBe('Usuário Teste Completo')
      expect(actualPayload.email).toBe('completo@teste.com')
      expect(actualPayload.phone).toBe('+5511911112222')
      expect(actualPayload.attempt).toBe(1)
      expect(actualPayload.cookies).toBe(
        JSON.stringify({
          _ga: 'GA1.1.2118071165.1750798754',
          _ga_XDN3ECHJXG: 'GS2.1.s1752604455',
        })
      )
    })
  })

  it('deve montar e enviar o payload correto para validateSms', async () => {
    vi.mocked(api.validateSms).mockResolvedValue({ success: true })
    act(() => {
      useFormStore.setState({
        currentStep: 2,
        data: { contactId: '139974446649' },
      })
    })

    const { result } = renderHook(() => useAdhesionForm())

    await act(async () => {
      result.current.form.setValue('smsCode', '281591')
      await result.current.onSubmit()
    })

    await waitFor(() => {
      expect(api.validateSms).toHaveBeenCalledTimes(1)
    })

    const expectedPayload = {
      contactId: '139974446649',
      smsCode: '281591',
    }

    expect(api.validateSms).toHaveBeenCalledWith(expectedPayload)
  })

  it('deve montar e enviar o payload correto para submitDocuments (CPF)', async () => {
    vi.mocked(api.submitDocuments).mockResolvedValue({ success: true })
    const contactData = {
      contactId: '139974446649',
      dealId: '40599079765',
      name: 'rafael felipe ribeiro',
    }
    act(() => {
      useFormStore.setState({ currentStep: 3, data: contactData })
    })

    const { result } = renderHook(() => useAdhesionForm())

    const documentData = {
      documentType: 'cpf' as const,
      isBillOwner: true,
      myCpf: '514.724.250-30',
    }

    await act(async () => {
      result.current.form.reset({ ...contactData, ...documentData })
      await result.current.onSubmit()
    })

    await waitFor(() => expect(api.submitDocuments).toHaveBeenCalledTimes(1))

    const expectedPayload = {
      contactId: '139974446649',
      dealId: '40599079765',
      contactName: 'rafael felipe ribeiro',
      document: {
        type: 'cpf',
        value: '514.724.250-30',
      },
    }

    expect(api.submitDocuments).toHaveBeenCalledWith(expectedPayload)
  })

  it('deve montar e enviar o payload correto para acceptContract', async () => {
    vi.mocked(api.acceptContract).mockResolvedValue({ success: true })
    const stateData = {
      contactId: '139974446649',
    }
    act(() => {
      useFormStore.setState({ currentStep: 4, data: stateData })
    })
    const { result } = renderHook(() => useAdhesionForm())

    const contractData = {
      termsAcceptedStep4: true,
      coupon: 'M158781515',
    }

    await act(async () => {
      result.current.form.reset({ ...stateData, ...contractData })
      await result.current.onSubmit()
    })

    await waitFor(() => expect(api.acceptContract).toHaveBeenCalledTimes(1))

    const expectedPayload = {
      contact_id: '139974446649',
      cupom_indicacao: 'M158781515',
      app: false,
    }

    expect(api.acceptContract).toHaveBeenCalledWith(expectedPayload)
  })

  it('deve gerar o cupom de indicação corretamente na etapa 5', () => {
    const contactId = '139974446649'
    act(() => {
      useFormStore.setState({
        currentStep: 5,
        data: { contactId: contactId },
      })
    })

    const { result } = renderHook(() => useAdhesionForm())

    const expectedCoupon = '10209720900D'

    expect(result.current.referralCoupon).toBe(expectedCoupon)
  })

  it('deve pular etapas de acordo com o flowConfig (ex: pular SMS)', async () => {
    vi.mocked(api.handleStep1Submission).mockResolvedValue({
      success: true,
      contact_id: 'skip-sms-contact',
      deal: { deal_id: 'skip-sms-deal' },
    })

    const steps: FlowStep[] = [1, 3, 4, 5]
    const flowConfig = {
      steps: steps,
    }

    const { result } = renderHook(() => useAdhesionForm({ flowConfig }))

    expect(result.current.currentStep).toBe(1)

    await act(async () => {
      result.current.form.reset(NEW_USER_DATA)
      await result.current.onSubmit()
    })

    await waitFor(() => expect(result.current.currentStep).toBe(3))
  })
})
