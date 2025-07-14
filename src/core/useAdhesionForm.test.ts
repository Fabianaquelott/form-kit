// src/core/useAdhesionForm.test.ts

import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFormStore } from './state/formStore'
import { useAdhesionForm } from './useAdhesionForm'
import * as api from './api/submitAdhesion'

// Mock do módulo de API para controlar as respostas em todos os testes
vi.mock('./api/submitAdhesion')

// --- DADOS DE TESTE ---
const NEW_USER_DATA = {
  name: 'Novo Usuário Teste Completo',
  email: 'completo@teste.com',
  phone: '(11) 91111-2222',
  termsAccepted: true,
}

const SMS_DATA = { smsCode: '123456' }
const DOCUMENT_DATA = {
  documentType: 'cpf' as const,
  myCpf: '12345678909',
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

describe('useAdhesionForm Hook', () => {
  beforeEach(() => {
    act(() => {
      useFormStore.getState().resetForm()
    })
    vi.clearAllMocks()
  })

  // --- TESTE DE FLUXO PRINCIPAL ---
  it('deve navegar com sucesso por todas as 5 etapas para um novo usuário', async () => {
    // Arrange
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

    // Act & Assert (Etapa por Etapa)

    // ETAPA 1: Dados Pessoais
    await act(async () => {
      result.current.form.reset(NEW_USER_DATA)
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(2))

    // ETAPA 2: SMS
    await act(async () => {
      result.current.form.reset({
        ...useFormStore.getState().data,
        ...SMS_DATA,
      })
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(3))

    // ETAPA 3: Documento
    await act(async () => {
      result.current.form.reset({
        ...useFormStore.getState().data,
        ...DOCUMENT_DATA,
      })
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(4))

    // ETAPA 4: Contrato
    await act(async () => {
      result.current.form.reset({
        ...useFormStore.getState().data,
        ...CONTRACT_DATA,
      })
      await result.current.onSubmit()
    })
    await waitFor(() => expect(result.current.currentStep).toBe(5))

    // Verificação Final na Etapa 5
    await waitFor(() => {
      expect(result.current.referralCoupon).not.toBeNull()
      expect(result.current.referralCoupon).toContain('10')
    })
  })

  // --- TESTES DE CENÁRIOS DE ERRO E ISOLADOS ---

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

  // --- TESTES DE FLUXOS DE USUÁRIO EXISTENTE ---

  describe('Fluxo de Usuário Existente', () => {
    it('deve navegar para a Etapa 3 (documentos) se o deal estiver incompleto', async () => {
      vi.mocked(api.handleStep1Submission).mockResolvedValue({
        success: false,
        code: 'user_already_exist',
      })
      vi.mocked(api.getUserByEmail).mockResolvedValue({
        success: true,
        contact: {
          id: 'e-id-1',
          firstname: 'Usuário',
          lastname: 'Antigo',
          email: EXISTING_USER_DATA.email,
          aceite_do_termo_de_adesao: 'false',
          validacao_do_numero: 'true',
          deal: { id: 'd-id-1', cpf: null },
        },
      })
      const { result } = renderHook(() => useAdhesionForm())
      await act(async () => {
        result.current.form.reset(EXISTING_USER_DATA)
        await result.current.onSubmit()
      })
      await waitFor(() => expect(result.current.currentStep).toBe(3))
    })

    it('deve navegar para a Etapa 4 (contrato) se o deal estiver completo mas o termo não foi aceito', async () => {
      vi.mocked(api.handleStep1Submission).mockResolvedValue({
        success: false,
        code: 'user_already_exist',
      })
      vi.mocked(api.getUserByEmail).mockResolvedValue({
        success: true,
        contact: {
          id: 'e-id-2',
          firstname: 'Usuário',
          lastname: 'QuaseLá',
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

    it('deve navegar para a Etapa 5 (conclusão) se o usuário já completou todo o fluxo', async () => {
      vi.mocked(api.handleStep1Submission).mockResolvedValue({
        success: false,
        code: 'user_already_exist',
      })
      vi.mocked(api.getUserByEmail).mockResolvedValue({
        success: true,
        contact: {
          id: 'e-id-3',
          firstname: 'Usuário',
          lastname: 'Completo',
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

  // --- TESTES DE FUNCIONALIDADES ESPECÍFICAS ---

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
