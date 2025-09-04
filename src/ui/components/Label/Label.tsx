import React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  children: React.ReactNode
}

export const Label: React.FC<LabelProps> = ({
  required,
  children,
  className,
  ...props
}) => {
  return (
    <label className={`label ${className || ''}`} {...props}>
      {children}
      {required && <span className="label__required" aria-label="obrigatório">*</span>}
    </label>
  )
}