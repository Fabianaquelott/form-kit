import React from 'react';
import { Button } from '../Button/Button';
import ArrowRight from '../../../assets/arrow.svg';
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
    if (currentStep >= 5) return null;

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

    const isFirstStep = currentStep === 1;

    return (
        <div className={styles.navigation}>
            {canGoPrevious && currentStep !== 1 && (
                <Button
                    type="button"
                    onClick={onPrevious}
                    disabled={isSubmitting}
                    className={styles.secondaryButtonLeft}
                >
                    <div className={styles.containerButtonLeft}>
                        <img src={ArrowRight} alt="" className={`${styles.arrowIcon} ${styles.arrowLeft}`} />
                        <span>Voltar</span>
                    </div>
                </Button>
            )}
            <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!isValid}
                className={!isFirstStep ? styles.secondaryButtonRight : styles.firstStepButton}
            >
                <div className={!isFirstStep ? styles.containerButtonRight : styles.containerFirstStepButton}>
                    <span>{getButtonLabel()}</span>
                    {!isFirstStep && <img src={ArrowRight} alt="" className={styles.arrowIcon} />}
                </div>
            </Button>
        </div>
    );
};
