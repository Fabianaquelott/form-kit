// src/ui/DefaultAdhesionForm.tsx

import React from 'react'
import { FormProvider } from 'react-hook-form'
import { useAdhesionForm, FlowConfig } from '@/core'
import { Button } from './components/Button/Button'
import StepOnePersonalData from './components/Steps/StepOnePersonalData'
import StepTwoSmsValidation from './components/Steps/StepTwoSmsValidation'
import styles from './DefaultAdhesionForm.module.css'
import StepThreeDocument from './components/Steps/StepThreeDocument'
import StepFourContract from './components/Steps/StepFourContract'
import Step5_Complete from './components/Steps/Step5_Complete'
import { StepIndicator } from './components/StepIndicator/StepIndicator'

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
        return <StepOnePersonalData />;
      case 2:
        return (
          <StepTwoSmsValidation
            handleResendSms={handleResendSms}
            resendCooldown={resendCooldown}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return <StepThreeDocument documentType={flowConfig?.documentType || 'both'} />;
      case 4:
        return <StepFourContract />;
      case 5:
        return <Step5_Complete referralCoupon={referralCoupon} />;
      default:
        return <div>Etapa não encontrada</div>;
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.formCard}>
        <StepIndicator currentStep={navigation.currentStepIndex} totalSteps={navigation.totalSteps} />
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