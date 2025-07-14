// src/ui/components/Steps/Step2_SmsValidation.tsx

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import styles from './Steps.module.scss';

interface Step2SmsValidationProps {
  handleResendSms: () => void;
  resendCooldown: number;
  isSubmitting: boolean;
}

const Step2_SmsValidation: React.FC<Step2SmsValidationProps> = ({
  handleResendSms,
  resendCooldown,
  isSubmitting
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Validação SMS</h2>
        <p className={styles.stepDescription}>
          Digite o código de 6 dígitos enviado para seu telefone.
        </p>
      </div>
      <div className={styles.stepContent}>
        <Input
          {...register('smsCode')}
          label="Código SMS"
          maxLength={6}
          errorMessage={errors.smsCode?.message as string || errors.general?.message as string}
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
  );
};

export default Step2_SmsValidation;