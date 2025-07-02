// src/core/api/submitAdhesion.ts

import type { AdhesionFormData, ApiResponse } from '../types'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
// A URL base agora é relativa, para que o MSW possa interceptá-la.
const API_BASE_URL = '/api'
const API_TIMEOUT = 10000 // 10 segundos

// Função utilitária para requisições HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    // Adicionando um delay simulado para todas as chamadas em dev
    if (import.meta.env.DEV) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP ${response.status}`,
        data: undefined,
      }
    }

    return {
      success: true,
      data: data.data, // Assumindo que os dados da API estão em um campo "data"
      message: data.message,
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      return {
        success: false,
        error:
          error.name === 'AbortError' ? 'Timeout na requisição' : error.message,
      }
    }

    return {
      success: false,
      error: 'Erro desconhecido na requisição',
    }
  }
}

// Função para criar contato inicial
export async function createContact(payload: {
  name: string
  email: string
  phone: string
}): Promise<ApiResponse<{ contactId: string }>> {
  console.log('🚀 (Mock) Criando contato:', payload)
  return apiRequest<{ contactId: string }>('/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Função para validar código SMS
export async function validateSms(payload: {
  contactId: string
  smsCode: string
}): Promise<ApiResponse<{ isValid: boolean }>> {
  console.log('📱 (Mock) Validando SMS:', payload)
  return apiRequest<{ isValid: boolean }>('/sms/validate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Função para finalizar adesão
export async function submitAdhesion(
  formData: AdhesionFormData
): Promise<ApiResponse<{ adhesionId: string; status: string }>> {
  console.log('✅ (Mock) Finalizando adesão:', formData)
  // Este endpoint ainda não tem um handler no mock, mas a estrutura está pronta.
  return apiRequest<{ adhesionId: string; status: string }>('/adhesions', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
}

// Função para reenviar SMS
export async function resendSms(
  contactId: string
): Promise<ApiResponse<{ sent: boolean }>> {
  console.log('🔄 (Mock) Reenviando SMS para:', contactId)
  // Este endpoint também precisaria de um handler no mock.
  return apiRequest<{ sent: boolean }>(`/sms/resend/${contactId}`, {
    method: 'POST',
  })
}
