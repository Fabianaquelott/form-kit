// src/ui/components/Steps/Step1_PersonalData.tsx

import React from 'react';
import { useFormContext } from 'react-hook-form';
import formStyles from '../../DefaultAdhesionForm.module.css'; // Importando estilos compartilhados
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import styles from './Steps.module.css';

const Step1_PersonalData: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const isEmailConfirmationRequired = watch('isEmailConfirmationRequired');

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <p className={styles.stepTitle}>Sua conta de <p>luz <span className={styles.stepTitleBold}>mais leve.</span></p></p>
        <p className={styles.stepDescription}>
          Junte-se a mais de 50 mil famílias e garanta até <p>15% de desconto no consumo de sua conta de luz</p> <p className={styles.stepDescriptionBold}>de forma simples e digital.</p>
        </p>
      </div>
      <div className={styles.stepContent}>
        <Input
          {...register('name')}
          label="Nome completo"
          errorMessage={errors.name?.message as string}
          required
          fullWidth
        />
        <Input
          {...register('email')}
          type="email"
          label="E-mail"
          errorMessage={errors.email?.message as string}
          required
          fullWidth
        />
        <Input
          {...register('phone')}
          type="tel"
          label="Telefone"
          errorMessage={errors.phone?.message as string}
          required
          fullWidth
        />

        {isEmailConfirmationRequired && (
          <div className={`${formStyles.checkboxContainer} ${formStyles.warningBox}`}>
            <input
              {...register('emailConfirmed')}
              type="checkbox"
              id="emailConfirmed"
              className={formStyles.checkbox}
            />
            <Label htmlFor="emailConfirmed" className={formStyles.checkboxLabel}>
              Meu e-mail está correto.
            </Label>
            {errors.emailConfirmed && <div className={formStyles.errorMessage}>{errors.emailConfirmed.message as string}</div>}
          </div>
        )}

        <div className={formStyles.checkboxContainer}>
          <input
            {...register('termsAccepted')}
            type="checkbox"
            id="terms"
            className={formStyles.checkbox}
          />
          <Label htmlFor="terms" className={formStyles.checkboxLabel}>
            Li e concordo com os <a href="#" className={formStyles.link}>termos e condições</a>.
          </Label>
          {errors.termsAccepted && <div className={formStyles.errorMessage}>{errors.termsAccepted.message as string}</div>}
        </div>
      </div>
    </div>
  );
};

export default Step1_PersonalData;