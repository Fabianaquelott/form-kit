import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './Input.module.css';

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
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  mask?: string; // Permite passar a máscara customizada
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
      type,
      mask,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!errorMessage;
    const inputState = hasError ? 'error' : state;

    // Máscara padrão para telefone (celular com 9 dígitos)
    const defaultMask = '(99) 99999-9999';

    const inputClassName = `${inputVariants({ size, state: inputState })} ${className || ''}`;

    const renderInput = () => {
      if (type === 'tel') {
        return (
          <InputMask
            mask={mask || defaultMask}
            maskChar={null}
            {...props}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                ref={ref}
                id={inputId}
                className={inputClassName}
                aria-invalid={hasError}
                aria-describedby={
                  hasError
                    ? `${inputId}-error`
                    : helperText
                    ? `${inputId}-helper`
                    : undefined
                }
              />
            )}
          </InputMask>
        );
      }

      return (
        <input
          ref={ref}
          id={inputId}
          className={inputClassName}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          type={type}
          {...props}
        />
      );
    };

    return (
      <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          {renderInput()}
          {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
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
    );
  }
);

Input.displayName = 'Input';
