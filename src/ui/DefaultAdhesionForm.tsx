import { FlowConfig, useAdhesionForm } from '@/core'
import React from 'react'
import { FormProvider } from 'react-hook-form'
import { StepIndicator } from './components/StepIndicator/StepIndicator'
import { StepNavigationButtons } from './components/StepNavigationButtons/StepNavigationButtons'
import StepFiveComplete from './components/Steps/StepFiveComplete'
import StepFourContract from './components/Steps/StepFourContract'
import StepOnePersonalData from './components/Steps/StepOnePersonalData'
import StepThreeDocument from './components/Steps/StepThreeDocument'
import StepTwoSmsValidation from './components/Steps/StepTwoSmsValidation'
import styles from './DefaultAdhesionForm.module.css'

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
            phoneNumber={formMethods.form.getValues('phone')}
          />
        );
      case 3:
        return <StepThreeDocument documentType={flowConfig?.documentType || 'both'} />;
      case 4:
        return <StepFourContract />;
      case 5:
        return <StepFiveComplete referralCoupon={referralCoupon} />;
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
            <StepNavigationButtons
              currentStep={currentStep}
              canGoPrevious={navigation.canGoPrevious}
              isLastStep={navigation.isLastStep}
              isSubmitting={isSubmitting}
              isValid={formMethods.form.formState.isValid}
              onPrevious={navigation.previousStep}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};