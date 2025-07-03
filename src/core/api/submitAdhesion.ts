// src/core/api/submitAdhesion.ts

import type {
  AdhesionFormData,
  ApiResponse,
  CreateContactPayload,
} from '../types'

const API_BASE_URL = '/api'
const API_TIMEOUT = 15000

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)
    const responseData = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || `HTTP ${response.status}`,
        ...responseData,
      }
    }

    return {
      success: true,
      ...responseData,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    const errorMessage =
      error instanceof Error
        ? error.name === 'AbortError'
          ? 'Timeout na requisição'
          : error.message
        : 'Erro desconhecido'
    return { success: false, error: errorMessage }
  }
}

async function processNewUser(
  payload: CreateContactPayload
): Promise<ApiResponse<any>> {
  // 1. Criar Contato
  const createContactResponse = await apiRequest('/v2/create-contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!createContactResponse.success || !createContactResponse.contact_id) {
    if (createContactResponse.code) {
      return createContactResponse
    }
    throw new Error(createContactResponse.error || 'Falha ao criar contato.')
  }

  const contactId = createContactResponse.contact_id

  // 2. Criar Deal
  const dealPayload = {
    contact_id: contactId,
    deal_name: payload.name,
    ...payload.urlParams,
  }
  const createDealResponse = await apiRequest('/v2/create-deal', {
    method: 'POST',
    body: JSON.stringify(dealPayload),
  })

  if (!createDealResponse.success) {
    throw new Error(createDealResponse.error || 'Falha ao criar negócio.')
  }

  // 3. Enviar SMS
  const smsPayload = {
    contact_id: contactId,
    resend: false,
    phone: `+55${payload.phone.replace(/\D/g, '')}`,
  }
  // CORREÇÃO: Alterado de POST para PATCH
  const sendSmsResponse = await apiRequest('/v2/generate-code-sms', {
    method: 'PATCH',
    body: JSON.stringify(smsPayload),
  })

  if (!sendSmsResponse.success) {
    throw new Error(sendSmsResponse.error || 'Falha ao enviar SMS.')
  }

  return { ...createContactResponse, deal: createDealResponse }
}

export async function handleStep1Submission(
  payload: CreateContactPayload
): Promise<ApiResponse<any>> {
  return processNewUser(payload)
}

export async function validateSms(payload: {
  contactId: string
  smsCode: string
}): Promise<ApiResponse<any>> {
  return apiRequest<any>('/v2/validate-code-sms', {
    method: 'PATCH',
    body: JSON.stringify({
      contact_id: payload.contactId,
      code: payload.smsCode,
    }),
  })
}

export async function resendSms(payload: {
  contactId: string
  phone: string
}): Promise<ApiResponse<{ sent: boolean }>> {
  // CORREÇÃO: Alterado de POST para PATCH
  return apiRequest<{ sent: boolean }>('/v2/generate-code-sms', {
    method: 'PATCH',
    body: JSON.stringify({
      contact_id: payload.contactId,
      phone: `+55${payload.phone.replace(/\D/g, '')}`,
      resend: true,
    }),
  })
}
