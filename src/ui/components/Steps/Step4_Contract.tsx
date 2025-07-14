// src/ui/components/Steps/Step4_Contract.tsx

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '../Input/Input'
import { Label } from '../Label/Label'
import styles from './Steps.module.css'

const Step4_Contract: React.FC = () => {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Termo de Adesão</h2>
        <p className={styles.stepDescription}>
          Leia e aceite os termos para finalizar.
        </p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.termsBox}>
          <p>
            O presente <u>Termo de Adesão</u> tem como Objeto a adesão, pelo(a) Aderente Locatário(a),
            ao serviço de geração compartilhada...
          </p>
          <p>
            Ao realizar a adesão, o(a) Aderente Locatário(a) concorda em aderir à Bulbe Energia
            Cooperativa (“Cooperativa”)...
          </p>
          {/* Adicionar o resto do texto do contrato aqui */}
        </div>

        <Input
          {...register('coupon')}
          label="Cupom de indicação (opcional)"
          placeholder="INSIRA SEU CUPOM"
          errorMessage={errors.coupon?.message as string}
          fullWidth
        />

        <div className={styles.checkboxContainer}>
          <input
            {...register('termsAcceptedStep4')}
            type="checkbox"
            id="termsStep4"
            className={styles.checkbox}
          />
          <Label htmlFor="termsStep4" className={styles.checkboxLabel}>
            Li e concordo com o <strong>Termo de Adesão</strong>.
          </Label>
          {errors.termsAcceptedStep4 && <div className={styles.errorMessage}>{errors.termsAcceptedStep4.message as string}</div>}
        </div>
      </div>
    </div>
  )
}

export default Step4_Contract;