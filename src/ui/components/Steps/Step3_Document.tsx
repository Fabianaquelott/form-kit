// src/ui/components/Steps/Step3_Document.tsx

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'
import styles from './Steps.module.scss'

const Step3_Document: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext()
  const documentType = watch('documentType')

  const handleSelectType = (type: 'cpf' | 'cnpj') => {
    setValue('documentType', type, { shouldValidate: true });
    if (type === 'cpf') {
      setValue('cnpj', '');
    } else {
      setValue('cpf', '');
    }
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Seus Documentos</h2>
        <p className={styles.stepDescription}>Onde você quer economizar energia?</p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.buttonGroup}>
          <Button
            type="button"
            variant={documentType === 'cpf' ? 'primary' : 'outline'}
            onClick={() => handleSelectType('cpf')}
            fullWidth
          >
            Casa (CPF)
          </Button>
          <Button
            type="button"
            variant={documentType === 'cnpj' ? 'primary' : 'outline'}
            onClick={() => handleSelectType('cnpj')}
            fullWidth
          >
            Empresa (CNPJ)
          </Button>
        </div>

        {documentType === 'cpf' && (
          <Input
            {...register('cpf')}
            label="CPF do titular da conta de luz"
            placeholder="000.000.000-00"
            errorMessage={errors.cpf?.message as string}
            required
            fullWidth
          />
        )}

        {documentType === 'cnpj' && (
          <Input
            {...register('cnpj')}
            label="CNPJ do titular da conta de luz"
            placeholder="00.000.000/0000-00"
            errorMessage={errors.cnpj?.message as string}
            required
            fullWidth
          />
        )}
      </div>
    </div>
  )
}

export default Step3_Document