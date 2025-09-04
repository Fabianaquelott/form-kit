import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      outline: 'button--outline',
      ghost: 'button--ghost',
      danger: 'button--danger',
      linkMuted: 'button--link-muted',
    },
    size: {
      sm: 'button--sm',
      md: 'button--md',
      lg: 'button--lg',
    },
    fullWidth: {
      true: 'button--full-width',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        className={`${buttonVariants({ variant, size, fullWidth })} ${className || ''}`}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <div className="button__spinner" aria-hidden="true">
            <div className="button__spinner-icon" />
          </div>
        )}

        {!isLoading && leftIcon && (
          <span className="button__left-icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span className={isLoading ? 'button__loading-text' : ''}>
          {children}
        </span>

        {!isLoading && rightIcon && (
          <span className="button__right-icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'