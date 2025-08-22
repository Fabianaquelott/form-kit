import React from 'react';
import { Button } from '../Button/Button';
import styles from './StepNavigationButtons.module.css';

interface StepNavigationButtonsProps {
  currentStep: number;
  canGoPrevious: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  onPrevious: () => void;
}

export const StepNavigationButtons: React.FC<StepNavigationButtonsProps> = ({
  currentStep,
  canGoPrevious,
  isLastStep,
  isSubmitting,
  isValid,
  onPrevious
}) => {
  if (currentStep >= 5) return null; // não mostra no passo final

  const getButtonLabel = () => {
    switch (currentStep) {
      case 1:
        return 'Quero economizar';
      case 2:
      case 3:
        return 'Próximo';
      case 4:
        return 'Concordar e contratar';
      default:
        return isLastStep ? 'Finalizar' : 'Concluir';
    }
  };

  return (
    <div className={styles.navigation}>
      {canGoPrevious && currentStep !== 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Voltar
        </Button>
      )}
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!isValid}
      >
        {getButtonLabel()}
      </Button>
    </div>
  );
};
