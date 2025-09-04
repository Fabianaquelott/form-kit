import React from 'react';
import { Button } from '../Button/Button';
import ArrowRight from '../../../assets/arrow.svg';

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
        <div className="step-navigation">
            {canGoPrevious && currentStep !== 1 && currentStep !== 3 && (
                <Button
                    type="button"
                    onClick={onPrevious}
                    disabled={isSubmitting}
                    className="step-navigation__secondary-button-left">
                    <div aria-label="Botão voltar" className="step-navigation__container-button-left">
                        <img src={ArrowRight} alt="" className={`step-navigation__arrow-icon step-navigation__arrow-left`} />
                        <span>Voltar</span>
                    </div>
                </Button>
            )}
            <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={!isValid}
                className={!isFirstStep ? 'step-navigation__secondary-button-right' : 'step-navigation__first-step-button'}>
                <div arial-label={`Botão ${getButtonLabel()}`} className={!isFirstStep ? 'step-navigation__container-button-right' : 'step-navigation__container-first-step-button'}>
                    <span>{getButtonLabel()}</span>
                    {!isFirstStep && <img src={ArrowRight} alt="" className="step-navigation__arrow-icon" />}
                </div>
            </Button>
        </div>
    );
};
