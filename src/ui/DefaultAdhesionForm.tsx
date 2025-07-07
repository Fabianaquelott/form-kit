// src/ui/DefaultAdhesionForm.tsx

import React from 'react'
import { FormProvider } from 'react-hook-form'
import { useAdhesionForm } from '@/core'
import { Button } from './components/Button/Button'
import { Input } from './components/Input/Input'
import { Label } from './components/Label/Label'
import styles from './DefaultAdhesionForm.module.scss'

import Step3_Document from './components/Steps/Step3_Document'
import Step4_Contract from './components/Steps/Step4_Contract'
import Step5_Complete from './components/Steps/Step5_Complete'

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
  const formMethods = useAdhesionForm({
    onSubmitSuccess: onSuccess,
    onSubmitError: onError,
  })

  const {
    currentStep,
    isSubmitting,
    errors,
    navigation,
    onSubmit,
    handleResendSms,
    resendCooldown,
  } = formMethods

  const renderStep1 = () => (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Dados Pessoais</h2>
        <p className={styles.stepDescription}>
          Preencha seus dados para iniciar o processo de adesão
        </p>
      </div>
      <div className={styles.stepContent}>
        <Input {...formMethods.form.register('name')} label="Nome completo" errorMessage={errors.name?.message} required fullWidth />
        <Input {...formMethods.form.register('email')} type="email" label="E-mail" errorMessage={errors.email?.message} required fullWidth />
        <Input {...formMethods.form.register('phone')} type="tel" label="Telefone" errorMessage={errors.phone?.message} required fullWidth />
        <div className={styles.checkboxContainer}>
          <input {...formMethods.form.register('termsAccepted')} type="checkbox" id="terms" className={styles.checkbox} />
          <Label htmlFor="terms" className={styles.checkboxLabel}>
            Li e concordo com os <a href="#" className={styles.link}>termos e condições</a>.
          </Label>
          {errors.termsAccepted && <div className={styles.errorMessage}>{errors.termsAccepted.message}</div>}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className={styles.step}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Validação SMS</h2>
        <p className={styles.stepDescription}>
          Digite o código de 6 dígitos enviado para seu telefone.
        </p>
      </div>
      <div className={styles.stepContent}>
        <Input
          {...formMethods.form.register('smsCode')}
          label="Código SMS"
          maxLength={6}
          errorMessage={errors.smsCode?.message || (currentStep === 2 ? errors.general : '')}
          required
          fullWidth
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResendSms}
          disabled={resendCooldown > 0 || isSubmitting}
        >
          {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
        </Button>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return <Step3_Document />;
      case 4: return <Step4_Contract />;
      case 5: return <Step5_Complete />;
      default: return <div>Etapa não encontrada</div>;
    }
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.formCard}>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            Etapa {currentStep} de 5
          </span>
        </div>
        <FormProvider {...formMethods.form}>
          <form onSubmit={onSubmit} className={styles.form}>
            {renderCurrentStep()}
            {errors.general && currentStep !== 2 && (
              <div className={styles.generalError} role="alert">
                {errors.general}
              </div>
            )}
            <div className={styles.navigation}>
              {navigation.canGoPrevious && (
                <Button type="button" variant="outline" onClick={navigation.previousStep} disabled={isSubmitting}>
                  Voltar
                </Button>
              )}
              <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                {navigation.isLastStep ? 'Finalizar' : 'Continuar'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}