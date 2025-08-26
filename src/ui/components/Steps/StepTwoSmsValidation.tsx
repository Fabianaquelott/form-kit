import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import styles from './StepTwoSmsValidation.module.css';

interface StepTwoSmsValidationProps {
  handleResendSms: () => void;
  resendCooldown: number;
  isSubmitting: boolean;
  phoneNumber: string;
}

const StepTwoSmsValidation: React.FC<StepTwoSmsValidationProps> = ({
  handleResendSms,
  resendCooldown,
  isSubmitting,
  phoneNumber
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Valide seu formato de contato.</h2>
        <p className={styles.stepDescription}>
          Digite o código enviado por SMS para o número:
        </p>
        <p className={styles.stepPhoneNumber}>
          {phoneNumber}
        </p>
      </div>
      <div className={styles.stepContent}>
        <Input
          {...register('smsCode')}
          label="Código de ativação"
          maxLength={6}
          errorMessage={errors.smsCode?.message as string || errors.general?.message as string}
          required
          placeholder="- - - - - -"
          fullWidth
        />
        <Button
          type="button"
          variant="linkMuted"
          size="sm"
          onClick={handleResendSms}
          disabled={resendCooldown > 0 || isSubmitting}
        >
          {resendCooldown > 0 ? `Reenviar código (${resendCooldown}seg)` : 'Reenviar código (30seg)'}
        </Button>
      </div>
    </div>
  );
};

export default StepTwoSmsValidation;