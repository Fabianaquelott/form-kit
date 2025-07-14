// src/ui/components/Steps/Step3_Document.tsx

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Label } from '../Label/Label';
import styles from './Steps.module.css';

const Step3_Document: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const documentType = watch('documentType');
  const isBillOwner = watch('isBillOwner');
  const dontKnowBillOwnerCpf = watch('dontKnowBillOwnerCpf');

  const handleSelectType = (type: 'cpf' | 'cnpj') => {
    setValue('documentType', type, { shouldValidate: true });
    if (type === 'cpf') {
      setValue('cnpj', '');
    } else {
      setValue('cpf', '');
      setValue('myCpf', '');
      setValue('isBillOwner', undefined);
    }
  };

  const handleBillOwnerChange = (isOwner: boolean) => {
    setValue('isBillOwner', isOwner, { shouldValidate: true });
  };

  const handleKnowCpfToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('dontKnowBillOwnerCpf', event.target.checked, { shouldValidate: true });
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Seus Documentos</h2>
        <p className={styles.stepDescription}>Onde você quer economizar energia?</p>
      </div>

      <div className={styles.stepContent}>
        <div className={styles.buttonGroup}>
          <Button type="button" variant={documentType === 'cpf' ? 'primary' : 'outline'} onClick={() => handleSelectType('cpf')} fullWidth>Casa (CPF)</Button>
          <Button type="button" variant={documentType === 'cnpj' ? 'primary' : 'outline'} onClick={() => handleSelectType('cnpj')} fullWidth>Empresa (CNPJ)</Button>
        </div>

        {documentType === 'cpf' && (
          <>
            <Input {...register('myCpf')} label="Meu CPF" placeholder="000.000.000-00" errorMessage={errors.myCpf?.message as string} fullWidth />

            <div className={styles.radioGroup}>
              <p>A conta de luz está em seu nome?*</p>
              <Button type="button" variant={isBillOwner === true ? 'primary' : 'outline'} onClick={() => handleBillOwnerChange(true)}>Sim</Button>
              <Button type="button" variant={isBillOwner === false ? 'primary' : 'outline'} onClick={() => handleBillOwnerChange(false)}>Não</Button>
              {errors.isBillOwner && <p className={styles.errorMessage}>{errors.isBillOwner.message as string}</p>}
            </div>

            {isBillOwner === false && (
              <>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" {...register('dontKnowBillOwnerCpf')} id="dontKnowCpf" onChange={handleKnowCpfToggle} className={styles.checkbox} />
                  <Label htmlFor="dontKnowCpf" className={styles.checkboxLabel}>Não sei o CPF do titular da conta.</Label>
                </div>

                {dontKnowBillOwnerCpf ? (
                  <div>
                    <Label htmlFor="billFile">Envie a conta de luz*</Label>
                    <Input id="billFile" type="file" {...register('billFile')} accept="image/*,application/pdf" errorMessage={errors.billFile?.message as string} />
                  </div>
                ) : (
                  <Input {...register('billOwnerCpf')} label="CPF do titular da conta de luz" placeholder="000.000.000-00" errorMessage={errors.billOwnerCpf?.message as string} fullWidth />
                )}
              </>
            )}
          </>
        )}

        {documentType === 'cnpj' && (
          <Input {...register('cnpj')} label="CNPJ do titular da conta de luz" placeholder="00.000.000/0000-00" errorMessage={errors.cnpj?.message as string} fullWidth />
        )}
      </div>
    </div>
  );
};

export default Step3_Document;