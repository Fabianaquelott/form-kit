import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';

const inputVariants = cva('input', {
  variants: {
    size: {
      sm: 'input--sm',
      md: 'input--md',
      lg: 'input--lg',
    },
    state: {
      default: '',
      error: 'input--error',
      success: 'input--success',
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
  mask?: string;
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
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!errorMessage;
    const inputState = hasError ? 'error' : state;

    const defaultMask = '(99) 99999-9999';

    const inputClassName = `${inputVariants({ size, state: inputState })} ${className || ''}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'token') {
        const filtered = e.target.value.replace(/\D/g, '').slice(0, 6);
        e.target.value = filtered;
      }
      onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === 'token') {
        // Permite apenas números, backspace, delete, setas
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab') {
          e.preventDefault();
        }
      }
    };


    const renderInput = () => {
      if (type === 'tel') {
        return (
          <InputMask
            mask={mask || defaultMask}
            maskChar={null}
            onChange={handleChange}
            {...props}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                ref={ref}
                id={inputId}
                onKeyDown={handleKeyDown}
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
          onChange={handleChange}
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
      <div className={`input-container ${fullWidth ? 'input-container--full-width' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}
        <div className="input-wrapper">
          {leftIcon && <div className="input__left-icon">{leftIcon}</div>}
          {renderInput()}
          {rightIcon && <div className="input__right-icon">{rightIcon}</div>}
        </div>
        {hasError && (
          <div id={`${inputId}-error`} className="input__error-message" role="alert">
            {errorMessage}
          </div>
        )}
        {!hasError && helperText && (
          <div id={`${inputId}-helper`} className="input__helper-text">
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
