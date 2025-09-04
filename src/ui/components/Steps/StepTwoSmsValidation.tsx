import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

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
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Valide seu formato de contato.</h2>
        <p className="step-description">
          Digite o código enviado por SMS para o número:
        </p>
        <p className="step-phone-number">
          {phoneNumber}
        </p>
      </div>
      <div className="step-two-content">
        <Input
          {...register('smsCode')}
          label="Código de ativação"
          maxLength={6}
          errorMessage={errors.smsCode?.message as string || errors.general?.message as string}
          required
          placeholder="- - - - - -"
          type='token'
          fullWidth
          aria-label="Código de ativação"
        />
        <Button
          type="button"
          variant="linkMuted"
          size="sm"
          onClick={handleResendSms}
          disabled={resendCooldown > 0 || isSubmitting}
          aria-label="Reenviar código de ativação por SMS"
        >
          {resendCooldown > 0 ? `Reenviar código (${resendCooldown}seg)` : 'Reenviar código (30seg)'}
        </Button>
      </div>
    </div>
  );
};

export default StepTwoSmsValidation;