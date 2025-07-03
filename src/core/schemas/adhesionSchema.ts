import { z } from 'zod'

// Regex para validar nomes, aceitando caracteres comuns em nomes brasileiros e latinos.
const NAME_REGEX = /^[a-zA-Z\u00C0-\u017F´`~^. ]+$/

// Regex aprimorada para telefones brasileiros, aceitando DDD 00.
const BRAZILIAN_PHONE_REGEX =
  /^(?:\(?([0-9]{2})\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/

// Schema para Etapa 1: Dados pessoais
export const personalDataSchema = z.object({
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
})

// Schema para Etapa 2: Validação SMS
export const smsValidationSchema = z.object({
  smsCode: z
    .string({ required_error: 'O código SMS é obrigatório.' })
    .length(6, 'O código SMS deve ter exatamente 6 dígitos.')
    .regex(/^\d{6}$/, 'O código deve conter apenas números.'),
})

// Schema completo do formulário de adesão
export const adhesionFormSchema = z.object({
  ...personalDataSchema.shape,
  ...smsValidationSchema.partial().shape,
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
