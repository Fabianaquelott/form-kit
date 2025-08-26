import React from 'react';
import { useFormContext } from 'react-hook-form';
import formStyles from '../../DefaultAdhesionForm.module.css';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import styles from './StepOnePersonalData.module.css';

const StepOnePersonalData: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const isEmailConfirmationRequired = watch('isEmailConfirmationRequired');

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>
          Sua conta de luz<br />
          <span className={styles.stepTitleBold}>mais leve.</span>
        </h1>
        <p className={styles.stepDescription}>
          Junte-se a mais de 50 mil famílias e garanta até 15% de desconto no consumo de sua conta de luz{' '}
          <span className={styles.stepDescriptionBold}>de forma simples e digital.</span>
        </p>
      </div>

      <div className={styles.stepContent}>
        <Input
          {...register('name')}
          label="Nome completo"
          placeholder="Nome e sobrenome"
          errorMessage={errors.name?.message as string}
          required
          fullWidth
          aria-label='Nome completo'
        />

        <Input
          {...register('email')}
          type="email"
          label="E-mail"
          placeholder="exemplo@email.com"
          errorMessage={errors.email?.message as string}
          required
          fullWidth
          aria-label='E-mail'
        />

        <Input
          {...register('phone')}
          type="tel"
          label="Número de celular"
          mask="(99) 99999-9999"
          placeholder="(00) 9 0000-0000"
          errorMessage={errors.phone?.message as string}
          required
          fullWidth
          aria-label='Número de celular'
        />

        {isEmailConfirmationRequired && (
          <div className={`${formStyles.checkboxContainer} ${formStyles.warningBox}`}>
            <input
              {...register('emailConfirmed')}
              type="checkbox"
              id="emailConfirmed"
              className={formStyles.checkbox}
              aria-label='Confirmação de e-mail'
            />
            <Label htmlFor="emailConfirmed" className={formStyles.checkboxLabel}>
              Meu e-mail está correto.
            </Label>
            {errors.emailConfirmed && (
              <div className={formStyles.errorMessage}>
                {errors.emailConfirmed.message as string}
              </div>
            )}
          </div>
        )}

        <div aria-label='Política de Privacidade'>
          <p className={styles.policyText}>
            Ao submeter minhas respostas e clicar{' '}
            <span className={styles.policyTextBold}>“Quero economizar”, </span>
            concordo com a{' '}
            <span className={styles.blockText}>
              <a href="/politica-de-privacidade" className={styles.policyTextLink}>
                Política de Privacidade
              </a>{' '}
              da Bulbe energia.
            </span>
          </p>
          <input {...register('termsAccepted')} type="hidden" value="true" />
        </div>
      </div>
    </div>
  );
};

export default StepOnePersonalData;
