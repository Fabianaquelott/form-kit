// src/core/types/index.ts

import { FieldErrors } from 'react-hook-form'

export interface UrlParams {
  hs_facebook_click_id?: string
  hs_google_click_id?: string
  utm_campaign?: string
  utm_content?: string
  utm_medium?: string
  utm_source?: string
  utm_term?: string
  [key: string]: any
}

export interface Deal {
  id?: string
  deal_id?: string
  contact_id?: string
  deal_name?: string
  cpf?: string | null
  cnpj?: string | null
  natureza_juridica?: string
  pipeline?: string
  dealstage?: string
  utm_source?: string
  utm_content?: string
}

export interface Contact {
  id?: string
  contact_id?: string
  email?: string
  phone?: string
  firstname?: string
  lastname?: string
  aceite_do_termo_de_adesao?: string
  validacao_do_numero?: string
  deal?: Deal
}

export interface AdhesionFormData {
  // Etapa 1
  name: string
  email: string
  phone: string
  termsAccepted: boolean
  isEmailConfirmationRequired?: boolean
  emailConfirmed?: boolean
  contactId?: string
  dealId?: string
  urlParams?: UrlParams
  contact?: Contact
  attempt?: number

  // Etapa 2
  smsCode?: string

  // Etapa 3
  documentType?: 'cpf' | 'cnpj'
  myCpf?: string
  isBillOwner?: boolean
  billOwnerCpf?: string
  dontKnowBillOwnerCpf?: boolean
  billFile?: FileList | null
  cnpj?: string

  // Etapa 4
  coupon?: string
  termsAcceptedStep4?: boolean

  // Etapa 5
  referralCoupon?: string
}

export interface CreateContactPayload {
  firstname: string
  lastname: string
  email: string
  phone: string
  attempt: number
  utm_campaign?: string
  utm_content?: string
  utm_medium?: string
  utm_source?: string
  utm_term?: string
  [key: string]: any
}

export interface AcceptContractPayload {
  contact_id: string
  cupom_indicacao?: string
  utm_indique_ganhe?: boolean
  app?: boolean
}

export type FormErrors = FieldErrors<AdhesionFormData> & {
  general?: string
}

export interface AdhesionFormState {
  currentStep: number
  totalSteps: number
  data: Partial<AdhesionFormData>
  isSubmitting: boolean
  errors: { general?: string; [key: string]: any }
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
  info?: string
  code?: string
  contact_id?: string
  contact?: Contact
  deal?: any
}
