// src/ui/DefaultAdhesionForm.tsx

import React from 'react'
import { FormProvider } from 'react-hook-form'
import { useAdhesionForm, FlowConfig } from '@/core'
import { Button } from './components/Button/Button'
import styles from './DefaultAdhesionForm.module.css'

import Step1_PersonalData from './components/Steps/Step1_PersonalData'
import Step2_SmsValidation from './components/Steps/Step2_SmsValidation'
import Step3_Document from './components/Steps/Step3_Document'
import Step4_Contract from './components/Steps/Step4_Contract'
import Step5_Complete from './components/Steps/Step5_Complete'

export interface DefaultAdhesionFormProps {
  flowConfig?: FlowConfig;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const DefaultAdhesionForm: React.FC<DefaultAdhesionFormProps> = ({
  flowConfig,
  onSuccess,
  onError,
  className,
}) => {
  const formMethods = useAdhesionForm({
    flowConfig,
    onSubmitSuccess: onSuccess,
    onSubmitError: onError,
  });

  const {
    currentStep,
    isSubmitting,
    errors,
    navigation,
    onSubmit,
    handleResendSms,
    resendCooldown,
    referralCoupon,
  } = formMethods;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_PersonalData />;
      case 2:
        return (
          <Step2_SmsValidation
            handleResendSms={handleResendSms}
            resendCooldown={resendCooldown}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return <Step3_Document documentType={flowConfig?.documentType || 'both'} />;
      case 4:
        return <Step4_Contract />;
      case 5:
        return <Step5_Complete referralCoupon={referralCoupon} />;
      default:
        return <div>Etapa não encontrada</div>;
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.formCard}>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((navigation.currentStepIndex + 1) / navigation.totalSteps) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            Etapa {navigation.currentStepIndex + 1} de {navigation.totalSteps}
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
            {currentStep < 5 && (
              <div className={styles.navigation}>
                {navigation.canGoPrevious && (
                  <Button type="button" variant="outline" onClick={navigation.previousStep} disabled={isSubmitting}>
                    Voltar
                  </Button>
                )}
                <Button type="submit" isLoading={isSubmitting} disabled={!formMethods.form.formState.isValid}>
                  {navigation.isLastStep ? 'Finalizar' : 'Concluir'}
                </Button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};