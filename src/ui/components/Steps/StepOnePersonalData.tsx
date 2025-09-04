import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';

const StepOnePersonalData: React.FC = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const isEmailConfirmationRequired = watch('isEmailConfirmationRequired');

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-one-title">
          Sua conta de luz<br />
          <span className="step-one-title--bold">mais leve.</span>
        </h1>
        <p className="step-one-description">
          Junte-se a mais de 50 mil famílias e garanta até 15% de desconto no consumo de sua conta de luz{' '}
          <span className="step-one-description--bold">de forma simples e digital.</span>
        </p>
      </div>

      <div className="step-one-content">
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
          <div className="form-checkbox-container form-warning-box">
            <input
              {...register('emailConfirmed')}
              type="checkbox"
              id="emailConfirmed"
              className="step-checkbox"
              aria-label='Confirmação de e-mail'
            />
            <Label htmlFor="emailConfirmed" className="step-checkbox-label">
              Meu e-mail está correto.
            </Label>
            {errors.emailConfirmed && (
              <div className="form-error-message">
                {errors.emailConfirmed.message as string}
              </div>
            )}
          </div>
        )}

        <div aria-label='Política de Privacidade'>
          <p className="step-one-policy-text">
            Ao submeter minhas respostas e clicar{' '}
            <span className="step-one-policy-text--bold">"Quero economizar", </span>
            concordo com a{' '}
            <span className="step-one-block-text">
              <a href="/politica-de-privacidade" className="step-one-policy-text--link">
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
