// src/ui/components/Steps/Step3_Document.tsx
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Label } from '../Label/Label';
import styles from './Steps.module.css';

interface Step3DocumentProps {
  documentType: 'cpf' | 'cnpj' | 'both';
}

const Step3_Document: React.FC<Step3DocumentProps> = ({ documentType }) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const selectedDocumentType = watch('documentType');
  const isBillOwner = watch('isBillOwner');
  const dontKnowBillOwnerCpf = watch('dontKnowBillOwnerCpf');

  useEffect(() => {
    if (documentType !== 'both' && selectedDocumentType !== documentType) {
      setValue('documentType', documentType);
    }
  }, [documentType, selectedDocumentType, setValue]);


  const handleSelectType = (type: 'cpf' | 'cnpj') => {
    setValue('documentType', type, { shouldValidate: true });
    if (type === 'cpf') {
      setValue('cnpj', '');
    } else {
      setValue('myCpf', '');
      setValue('isBillOwner', undefined);
      setValue('billOwnerCpf', '');
      setValue('dontKnowBillOwnerCpf', false);
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
        {documentType === 'both' && (
          <div className={styles.buttonGroup}>
            <Button type="button" variant={selectedDocumentType === 'cpf' ? 'primary' : 'outline'} onClick={() => handleSelectType('cpf')} fullWidth>Casa (CPF)</Button>
            <Button type="button" variant={selectedDocumentType === 'cnpj' ? 'primary' : 'outline'} onClick={() => handleSelectType('cnpj')} fullWidth>Empresa (CNPJ)</Button>
          </div>
        )}

        {selectedDocumentType === 'cpf' && (
          <>
            <Input {...register('myCpf')} label="Meu CPF" placeholder="000.000.000-00" errorMessage={errors.myCpf?.message as string} fullWidth />

            <div className={styles.radioGroup}>
              <p>A conta de luz está em seu nome?*</p>
              <div>
                <Button type="button" variant={isBillOwner === true ? 'primary' : 'outline'} onClick={() => handleBillOwnerChange(true)}>Sim</Button>
                <Button type="button" variant={isBillOwner === false ? 'primary' : 'outline'} onClick={() => handleBillOwnerChange(false)}>Não</Button>
              </div>
              {errors.isBillOwner && <p className={styles.errorMessage}>{errors.isBillOwner.message as string}</p>}
            </div>

            {isBillOwner === false && (
              <>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" {...register('dontKnowBillOwnerCpf')} id="dontKnowCpf" onChange={handleKnowCpfToggle} />
                  <Label htmlFor="dontKnowCpf">Não sei o CPF do titular da conta.</Label>
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

        {selectedDocumentType === 'cnpj' && (
          <Input {...register('cnpj')} label="CNPJ do titular da conta de luz" placeholder="00.000.000/0000-00" errorMessage={errors.cnpj?.message as string} fullWidth />
        )}
      </div>
    </div>
  );
};

export default Step3_Document;