export interface AdhesionFormData {
  // Etapa 1: Dados pessoais
  name: string
  email: string
  phone: string
  termsAccepted: boolean
  contactId?: string

  // Etapa 2: Validação SMS (será expandida)
  smsCode?: string

  // Etapa 3: Dados adicionais (será expandida)
  additionalInfo?: Record<string, any>
}

export interface AdhesionFormState {
  currentStep: number
  totalSteps: number
  data: Partial<AdhesionFormData>
  isSubmitting: boolean
  errors: Record<string, string>
}

export interface FormNavigationState {
  canGoNext: boolean
  canGoPrevious: boolean
  isFirstStep: boolean
  isLastStep: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
