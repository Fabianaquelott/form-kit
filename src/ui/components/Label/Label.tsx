import React from 'react'

import styles from './Label.module.scss'

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
    <label className={`${styles.label} ${className || ''}`} {...props}>
      {children}
      {required && <span className={styles.required} aria-label="obrigatório">*</span>}
    </label>
  )
}