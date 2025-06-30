import { z } from 'zod'

// Schema para Etapa 1: Dados pessoais
export const personalDataSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .email('Email deve ter um formato válido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX')
    .min(14, 'Telefone deve ter o formato correto'),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, 'Você deve aceitar os termos e condições')
})

// Schema para Etapa 2: Validação SMS
export const smsValidationSchema = z.object({
  smsCode: z
    .string()
    .length(6, 'Código SMS deve ter 6 dígitos')
    .regex(/^\d{6}$/, 'Código deve conter apenas números')
})

// Schema completo do formulário de adesão
export const adhesionFormSchema = z.object({
  ...personalDataSchema.shape,
  ...smsValidationSchema.partial().shape
})

// Tipos inferidos dos schemas
export type PersonalDataForm = z.infer<typeof personalDataSchema>
export type SmsValidationForm = z.infer<typeof smsValidationSchema>
export type AdhesionFormSchema = z.infer<typeof adhesionFormSchema>

// Schemas por etapa para validação específica
export const stepSchemas = {
  1: personalDataSchema,
  2: smsValidationSchema,
  // Etapa 3 será adicionada futuramente
} as const

export type StepNumber = keyof typeof stepSchemas