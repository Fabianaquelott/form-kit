import React from 'react'

import { useAdhesionForm } from '@/core'
import { Button } from './components/Button/Button'
import { Input } from './components/Input/Input'
import { Label } from './components/Label/Label'
import styles from './DefaultAdhesionForm.module.scss'

export interface DefaultAdhesionFormProps {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  className?: string
}

export const DefaultAdhesionForm: React.FC<DefaultAdhesionFormProps> = ({
  onSuccess,
  onError,
  className,
}) => {
  const {
    form,
    currentStep,
    isSubmitting,
    errors,
    navigation,
    onSubmit,
  } = useAdhesionForm({
    onSubmitSuccess: onSuccess,
    onSubmitError: onError,
  })

  const { register, formState: { errors: formErrors } } = form

  const renderStep1 = () => (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Dados Pessoais</h2>
        <p className={styles.stepDescription}>
          Preencha seus dados para iniciar o processo de adesão
        </p>
      </div>

      <div className={styles.stepContent}>
        <Input
          {...register('name')}
          label="Nome completo"
          placeholder="Digite seu nome completo"
          errorMessage={formErrors.name?.message}
          required
          fullWidth
        />

        <Input
          {...register('email')}
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          errorMessage={formErrors.email?.message}
          required
          fullWidth
        />

        <Input
          {...register('phone')}
          type="tel"
          label="Telefone"
          placeholder="(11) 99999-9999"
          errorMessage={formErrors.phone?.message}
          required
          fullWidth
        />

        <div className={styles.checkboxContainer}>
          <input
            {...register('termsAccepted')}
            type="checkbox"
            className={styles.checkbox}
            id="terms"
          />
          <Label htmlFor="terms" className={styles.checkboxLabel}>
            Aceito os <a href="#" className={styles.link}>termos e condições</a>
          </Label>
          {formErrors.termsAccepted && (
            <div className={styles.errorMessage}>
              {formErrors.termsAccepted.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Validação SMS</h2>
        <p className={styles.stepDescription}>
          Digite o código de 6 dígitos enviado para seu telefone
        </p>
      </div>

      <div className={styles.stepContent}>
        <Input
          {...register('smsCode')}
          label="Código SMS"
          placeholder="123456"
          errorMessage={formErrors.smsCode?.message}
          maxLength={6}
          required
          fullWidth
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // TODO: Implementar reenvio de SMS
            console.log('Reenviando SMS...')
          }}
        >
          Reenviar código
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Finalizar Adesão</h2>
        <p className={styles.stepDescription}>
          Revise seus dados e finalize o processo
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.summary}>
          <h3>Resumo dos dados:</h3>
          <p><strong>Nome:</strong> {form.watch('name')}</p>
          <p><strong>E-mail:</strong> {form.watch('email')}</p>
          <p><strong>Telefone:</strong> {form.watch('phone')}</p>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return <div>Etapa não encontrada</div>
    }
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.formCard}>
        {/* Progress indicator */}
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            Etapa {currentStep} de 3
          </span>
        </div>

        {/* Form content */}
        <form onSubmit={onSubmit} className={styles.form}>
          {renderCurrentStep()}

          {/* General error */}
          {errors.general && (
            <div className={styles.generalError} role="alert">
              {errors.general}
            </div>
          )}

          {/* Navigation buttons */}
          <div className={styles.navigation}>
            {navigation.canGoPrevious && (
              <Button
                type="button"
                variant="outline"
                onClick={navigation.goToPreviousStep}
                disabled={isSubmitting}
              >
                Voltar
              </Button>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {navigation.isLastStep ? 'Finalizar' : 'Continuar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}