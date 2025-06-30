import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import styles from './Input.module.scss'

const inputVariants = cva(styles.input, {
  variants: {
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    state: {
      default: '',
      error: styles.error,
      success: styles.success,
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
})

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      state,
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      fullWidth,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!errorMessage
    const inputState = hasError ? 'error' : state
    
    return (
      <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        
        <div className={styles.inputWrapper}>
          {leftIcon && (
            <div className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`${inputVariants({ size, state: inputState })} ${className || ''}`}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className={styles.rightIcon} aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        
        {hasError && (
          <div id={`${inputId}-error`} className={styles.errorMessage} role="alert">
            {errorMessage}
          </div>
        )}
        
        {!hasError && helperText && (
          <div id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'