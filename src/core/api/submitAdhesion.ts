// src/core/api/submitAdhesion.ts

import type {
  ApiResponse,
  Contact,
  CreateContactPayload,
  Deal,
  AcceptContractPayload,
} from '../types'

const API_BASE_URL = '/main-api'
const API_ERP_BASE_URL = '/erp-api'
const API_TIMEOUT = 15000

const UPLOAD_BILL_PATH = '/HubSpot/UploadFotoContaDeLuz'

// --- Funções Auxiliares ---
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = (error) => reject(error)
  })

// Helper para a API Principal.
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
  const fullEndpoint = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(fullEndpoint, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })

    clearTimeout(timeoutId)
    const responseText = await response.text()
    const responseData = responseText ? JSON.parse(responseText) : {}

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || `HTTP Error ${response.status}`,
        ...responseData,
      }
    }
    return { success: true, ...responseData }
  } catch (error) {
    clearTimeout(timeoutId)
    const errorMessage =
      error instanceof Error
        ? error.name === 'AbortError'
          ? 'Timeout da requisição.'
          : error.message
        : 'Ocorreu um erro desconhecido.'
    return { success: false, error: errorMessage }
  }
}

async function apiErpRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
  const fullEndpoint = `${API_ERP_BASE_URL}${endpoint}`

  try {
    const response = await fetch(fullEndpoint, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })

    clearTimeout(timeoutId)
    const responseText = await response.text()
    const responseData = responseText ? JSON.parse(responseText) : {}

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || `HTTP Error ${response.status}`,
        ...responseData,
      }
    }
    return { success: true, ...responseData }
  } catch (error) {
    clearTimeout(timeoutId)
    const errorMessage =
      error instanceof Error
        ? error.name === 'AbortError'
          ? 'Timeout da requisição.'
          : error.message
        : 'Ocorreu um erro desconhecido.'
    return { success: false, error: errorMessage }
  }
}

async function processNewUser(
  payload: CreateContactPayload
): Promise<ApiResponse<any>> {
  const createContactResponse = await apiRequest('/v2/create-contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!createContactResponse.success || !createContactResponse.contact_id) {
    return createContactResponse
  }
  const contactId = createContactResponse.contact_id

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
    throw new Error(
      createDealResponse.error || 'Falha ao criar o negócio associado.'
    )
  }

  const smsPayload = {
    contact_id: contactId,
    resend: false,
    phone: `+55${payload.phone?.replace(/\D/g, '')}`,
  }
  const sendSmsResponse = await apiRequest('/v2/generate-code-sms', {
    method: 'PATCH',
    body: JSON.stringify(smsPayload),
  })

  if (!sendSmsResponse.success) {
    throw new Error(sendSmsResponse.error || 'Falha ao enviar o código SMS.')
  }
  return { ...createContactResponse, deal: createDealResponse }
}

// --- Funções Exportadas ---

export async function handleStep1Submission(
  payload: CreateContactPayload
): Promise<ApiResponse<any>> {
  return processNewUser(payload)
}

export async function getUserByEmail(
  email: string
): Promise<ApiResponse<Contact>> {
  return apiRequest<Contact>(
    `/get-contact-info?email=${encodeURIComponent(email)}`,
    { method: 'GET' }
  )
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
}): Promise<ApiResponse<any>> {
  return apiRequest<any>('/v2/generate-code-sms', {
    method: 'PATCH',
    body: JSON.stringify({
      contact_id: payload.contactId,
      phone: `+55${payload.phone.replace(/\D/g, '')}`,
      resend: true,
    }),
  })
}

export async function submitDocuments(payload: {
  contactId: string
  dealId: string
  contactName: string
  document: { type: 'cpf' | 'cnpj'; value: string }
}): Promise<ApiResponse<any>> {
  if (payload.document.type === 'cpf') {
    const updateCpfPayload = {
      contact_id: payload.contactId,
      cpf: payload.document.value,
    }
    const updateCpfResponse = await apiRequest('/v2/update-contact-cpf', {
      method: 'PATCH',
      body: JSON.stringify(updateCpfPayload),
    })
    if (!updateCpfResponse.success) return updateCpfResponse
  }

  const updateDealPayload: Partial<Deal> = {
    deal_id: payload.dealId,
    contact_id: payload.contactId,
    deal_name: `${payload.contactName} - ${payload.document.type.toUpperCase()}: ${payload.document.value}`,
    [payload.document.type]: payload.document.value,
    natureza_juridica:
      payload.document.type === 'cpf' ? 'Pessoa Física' : 'Pessoa Jurídica',
  }
  return await apiRequest('/v2/update-deal', {
    method: 'PATCH',
    body: JSON.stringify(updateDealPayload),
  })
}

export async function uploadBillFile(payload: {
  dealId: string
  file: File
}): Promise<ApiResponse<any>> {
  try {
    const base64String = await toBase64(payload.file)

    const uploadPayload = {
      hubSpotNegocioId: payload.dealId,
      payload: {
        faturaCemigBase64: base64String,
        extensaoArquivo: payload.file.name.split('.').pop() || '',
      },
    }

    return apiErpRequest<any>(UPLOAD_BILL_PATH, {
      method: 'POST',
      body: JSON.stringify(uploadPayload),
    })
  } catch (error: any) {
    return {
      success: false,
      error: 'Falha ao processar o arquivo para upload.',
    }
  }
}

export async function acceptContract(
  payload: AcceptContractPayload
): Promise<ApiResponse<any>> {
  return apiRequest<any>('/accept-contract', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
