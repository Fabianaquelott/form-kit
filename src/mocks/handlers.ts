// src/mocks/handlers.ts

import { http, HttpResponse, delay } from 'msw'
import type { AdhesionFormData } from '@/core'

const API_BASE = '/api'

export const handlers = [
  // Mock para criar contato (Etapa 1)
  http.post(`${API_BASE}/contacts`, async ({ request }) => {
    const data = (await request.json()) as { email?: string }

    await delay(1000) // Simula atraso da rede

    // Simula um e-mail já existente para teste de erro
    if (data.email?.includes('error@test.com')) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Este e-mail já está em uso.',
          data: null,
        },
        { status: 409 }
      )
    }

    // Resposta de sucesso
    return HttpResponse.json({
      success: true,
      message: 'Contato criado com sucesso',
      data: { contactId: `mock_contact_${Date.now()}` },
    })
  }),

  // Mock para validar código SMS (Etapa 2)
  http.post(`${API_BASE}/sms/validate`, async ({ request }) => {
    const data = (await request.json()) as { smsCode?: string }

    await delay(800)

    // Código de sucesso fixo para o mock
    const isValid = data.smsCode === '123456'

    if (!isValid) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Código SMS inválido. Tente novamente.',
          data: { isValid: false },
        },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      message: 'SMS validado com sucesso',
      data: { isValid: true },
    })
  }),

  // Mock para reenviar código SMS
  http.post(`${API_BASE}/sms/resend/:contactId`, async () => {
    await delay(1200)

    return HttpResponse.json({
      success: true,
      message: 'Novo código SMS enviado com sucesso.',
      data: { sent: true },
    })
  }),

  // Mock para finalizar adesão (Etapa 3)
  http.post(`${API_BASE}/adhesions`, async ({ request }) => {
    const data = (await request.json()) as AdhesionFormData

    await delay(1500)

    // Simula um erro na finalização para teste
    if (data.name?.toLowerCase().includes('erro')) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Não foi possível finalizar a adesão. Tente mais tarde.',
          data: null,
        },
        { status: 500 }
      )
    }

    return HttpResponse.json({
      success: true,
      message: 'Adesão realizada com sucesso!',
      data: {
        adhesionId: `adhesion_${Date.now()}`,
        status: 'completed',
        customerName: data.name,
      },
    })
  }),
]
