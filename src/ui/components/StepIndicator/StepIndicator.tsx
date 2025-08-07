import React from 'react';
import styles from './StepIndicator.module.css';

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={styles.wrapper}>
      <img src="/src/assets/bulbe-icon.svg" alt="Bulbe Logo" className={styles.logo} />

      <div className={styles.steps}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`${styles.step} ${currentStep + 1 === step ? styles.active : ''} ${
                step <= currentStep ? styles.done : ''
              }`}
            >
              {step}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`${styles.connector} ${step <= currentStep ? styles.connectorActive : ''}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
