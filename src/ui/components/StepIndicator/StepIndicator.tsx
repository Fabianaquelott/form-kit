import React from 'react';

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={` ${totalSteps === 2 ? 'step-indicator-wrapper--two-steps' : 'step-indicator-wrapper'}`}>
      <img src="/src/assets/bulbe-icon.svg" alt="Bulbe Logo" className="step-indicator__logo" />

      <div
        className={`step-indicator__steps ${totalSteps === 2 ? 'step-indicator__steps--two-steps' : ''}`}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`step-indicator__step ${currentStep + 1 === step ? 'step-indicator__step--active' : ''
                } ${step <= currentStep ? 'step-indicator__step--done' : ''}`}
            >
              {step}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`step-indicator__connector ${totalSteps === 2 ? 'step-indicator__connector--two-steps' : ''
                  } ${step <= currentStep ? 'step-indicator__connector--active' : ''}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
