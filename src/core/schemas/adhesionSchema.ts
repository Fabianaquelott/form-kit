// src/core/schemas/adhesionSchema.ts

import { z } from 'zod'

// --- Funções Utilitárias de Validação ---
const NAME_REGEX = /^[a-zA-Z\u00C0-\u017F´`~^. ]+$/
const BRAZILIAN_PHONE_REGEX =
  /^(?:\(?([0-9]{2})\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/
const hasAllSameDigits = (doc: string) =>
  new Set(doc.replace(/[^\d]/g, '').split('')).size === 1

const isValidCPF = (cpf: string) => {
  const cleanCpf = cpf.replace(/[^\d]+/g, '')
  if (cleanCpf.length !== 11 || hasAllSameDigits(cleanCpf)) return false
  let sum = 0,
    remainder
  for (let i = 1; i <= 9; i++)
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false
  sum = 0
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  return remainder === parseInt(cleanCpf.substring(10, 11))
}

// --- Schemas por Etapa ---

const basePersonalDataSchema = z.object({
  name: z
    .string({ required_error: 'O nome completo é obrigatório.' })
    .min(3, { message: 'O nome completo deve ter no mínimo 3 caracteres.' })
    .refine((val) => NAME_REGEX.test(val), {
      message: 'O nome deve conter apenas letras e espaços.',
    })
    .refine((val) => val.trim().split(' ').length >= 2, {
      message: 'Por favor, insira seu nome e sobrenome.',
    }),
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .min(1, { message: 'O e-mail é obrigatório.' })
    .email({
      message: 'Formato de e-mail inválido. Verifique o e-mail digitado.',
    }),
  phone: z
    .string({ required_error: 'O telefone é obrigatório.' })
    .min(10, { message: 'O telefone deve ter no mínimo 10 dígitos.' })
    .refine((phone) => BRAZILIAN_PHONE_REGEX.test(phone), {
      message: 'Formato de telefone inválido. Use (XX) XXXXX-XXXX.',
    }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Você precisa aceitar os termos para continuar.',
  }),
  isEmailConfirmationRequired: z.boolean().optional(),
  emailConfirmed: z.boolean().optional(),
})

export const personalDataSchema = basePersonalDataSchema.superRefine(
  (data, ctx) => {
    if (data.isEmailConfirmationRequired && !data.emailConfirmed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Por favor, confirme que seu e-mail está correto.',
        path: ['emailConfirmed'],
      })
    }
  }
)

export const smsValidationSchema = z.object({
  smsCode: z.string().length(6, 'O código deve ter 6 dígitos.'),
})

const baseDocumentSchema = z.object({
  documentType: z.enum(['cpf', 'cnpj']),
  myCpf: z.string().optional(),
  isBillOwner: z.boolean().optional(),
  billOwnerCpf: z.string().optional(),
  dontKnowBillOwnerCpf: z.boolean().optional(),
  billFile: z.instanceof(FileList).nullable().optional(),
  cnpj: z.string().optional(),
})

export const documentSchema = baseDocumentSchema.superRefine((data, ctx) => {
  if (data.documentType === 'cnpj') {
    if (!data.cnpj /* || !isValidCNPJ(data.cnpj) */) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CNPJ inválido.',
        path: ['cnpj'],
      })
    }
  }

  if (data.documentType === 'cpf') {
    if (typeof data.isBillOwner !== 'boolean') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione uma opção.',
        path: ['isBillOwner'],
      })
    } else if (data.isBillOwner === true) {
      if (!data.myCpf || !isValidCPF(data.myCpf)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Seu CPF é inválido.',
          path: ['myCpf'],
        })
      }
    } else if (data.isBillOwner === false) {
      if (data.dontKnowBillOwnerCpf) {
        if (!data.billFile || data.billFile.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'O envio da conta de luz é obrigatório.',
            path: ['billFile'],
          })
        }
      } else {
        if (!data.billOwnerCpf || !isValidCPF(data.billOwnerCpf)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CPF do titular inválido.',
            path: ['billOwnerCpf'],
          })
        }
      }
    }
  }
})

export const contractSchema = z.object({
  coupon: z
    .string()
    .max(30, 'O cupom não pode ter mais de 30 caracteres.')
    .optional(),
  termsAcceptedStep4: z.boolean().refine((val) => val === true, {
    message: 'Você precisa aceitar o termo de adesão para finalizar.',
  }),
})

// --- Schema Completo e Tipos ---

export const adhesionFormSchema = basePersonalDataSchema
  .merge(smsValidationSchema.partial())
  .merge(baseDocumentSchema.partial())
  .merge(contractSchema.partial())

// Tipos inferidos
export type PersonalDataForm = z.infer<typeof personalDataSchema>
export type SmsValidationForm = z.infer<typeof smsValidationSchema>
export type DocumentForm = z.infer<typeof documentSchema>
export type ContractForm = z.infer<typeof contractSchema>
export type AdhesionFormSchema = z.infer<typeof adhesionFormSchema>

// Schemas por etapa
export const stepSchemas = {
  1: personalDataSchema,
  2: smsValidationSchema,
  3: documentSchema,
  4: contractSchema,
} as const

export type StepNumber = keyof typeof stepSchemas
