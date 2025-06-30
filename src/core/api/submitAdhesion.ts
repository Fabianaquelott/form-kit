import type { AdhesionFormData, ApiResponse } from '../types'

// Configurações da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
const API_TIMEOUT = 10000 // 10 segundos

// Função utilitária para requisições HTTP
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
    
    const data = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP ${response.status}`,
        data: null,
      }
    }
    
    return {
      success: true,
      data,
      message: data.message,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.name === 'AbortError' ? 'Timeout na requisição' : error.message,
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
  console.log('🚀 Criando contato:', payload)
  
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock response para desenvolvimento
  if (import.meta.env.NODE_ENV === 'development') {
    return {
      success: true,
      data: { contactId: `contact_${Date.now()}` },
      message: 'Contato criado com sucesso',
    }
  }
  
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
  console.log('📱 Validando SMS:', payload)
  
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock response para desenvolvimento
  if (import.meta.env.NODE_ENV === 'development') {
    const isValid = payload.smsCode === '123456' // Código mock para desenvolvimento
    
    return {
      success: true,
      data: { isValid },
      message: isValid ? 'SMS validado com sucesso' : 'Código SMS inválido',
    }
  }
  
  return apiRequest<{ isValid: boolean }>('/sms/validate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Função para finalizar adesão
export async function submitAdhesion(
  formData: AdhesionFormData
): Promise<ApiResponse<{ adhesionId: string; status: string }>> {
  console.log('✅ Finalizando adesão:', formData)
  
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock response para desenvolvimento
  if (import.meta.env.NODE_ENV === 'development') {
    return {
      success: true,
      data: {
        adhesionId: `adhesion_${Date.now()}`,
        status: 'completed',
      },
      message: 'Adesão realizada com sucesso!',
    }
  }
  
  return apiRequest<{ adhesionId: string; status: string }>('/adhesions', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
}

// Função para reenviar SMS
export async function resendSms(contactId: string): Promise<ApiResponse<{ sent: boolean }>> {
  console.log('🔄 Reenviando SMS para:', contactId)
  
  // Simular delay da API
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Mock response para desenvolvimento
  if (import.meta.env.NODE_ENV === 'development') {
    return {
      success: true,
      data: { sent: true },
      message: 'SMS reenviado com sucesso',
    }
  }
  
  return apiRequest<{ sent: boolean }>(`/sms/resend/${contactId}`, {
    method: 'POST',
  })
}