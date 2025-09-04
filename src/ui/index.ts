// src/ui/index.ts

// Import styles
import './styles/index.css'

export { Button } from './components/Button/Button'
export type { ButtonProps } from './components/Button/Button'

export { Input } from './components/Input/Input'
export type { InputProps } from './components/Input/Input'

export { Label } from './components/Label/Label'
export type { LabelProps } from './components/Label/Label'

// Main form component
export { DefaultAdhesionForm } from './DefaultAdhesionForm'
export type { DefaultAdhesionFormProps } from './DefaultAdhesionForm'

// Exportando as novas variações de formulário ---
export { CpfOnlyAdhesionForm } from './forms/CpfOnlyAdhesionForm'
export { CnpjOnlyAdhesionForm } from './forms/CnpjOnlyAdhesionForm'
export { NoSmsAdhesionForm } from './forms/NoSmsAdhesionForm'
export { QuickCaptureAdhesionForm } from './forms/QuickCaptureAdhesionForm'
