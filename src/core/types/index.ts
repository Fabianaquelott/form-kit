// Tipos para os parâmetros de URL que capturamos
export interface UrlParams {
  hs_facebook_click_id?: string
  hs_google_click_id?: string
  utm_campaign?: string
  utm_content?: string
  utm_medium?: string
  utm_source?: string
  utm_term?: string
  [key: string]: any // Para outros parâmetros dinâmicos
}

// Payload para a criação de um contato, combinando dados do formulário e de URL
export interface CreateContactPayload extends AdhesionFormData, UrlParams {
  firstname: string
  lastname: string
  attempt: number
}

// Dados do formulário
export interface AdhesionFormData {
  // Etapa 1
  name: string
  email: string
  phone: string
  termsAccepted: boolean
  contactId?: string
  dealId?: string
  urlParams?: UrlParams

  // Etapa 2
  smsCode?: string

  // Etapa 3 (futuro)
  cpf?: string
  cnpj?: string
}

// Estado global do formulário
export interface AdhesionFormState {
  currentStep: number
  totalSteps: number
  data: Partial<AdhesionFormData>
  isSubmitting: boolean
  errors: Record<string, string>
}

// Estado da navegação
export interface FormNavigationState {
  canGoNext: boolean
  canGoPrevious: boolean
  isFirstStep: boolean
  isLastStep: boolean
}

// Resposta padrão da API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  contact_id?: string
  contact?: any
  deal?: any
}
