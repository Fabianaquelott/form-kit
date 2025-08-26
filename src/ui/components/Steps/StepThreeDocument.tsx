import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../Button/Button';
import { FileButtonInput, FileButtonInputRef } from '../Input/FileInput';
import { Input } from '../Input/Input';
import { Toggle } from '../Toggle/Toggle';
import styles from './StepThreeDocument.module.css';

interface StepThreeDocumentProps {
  documentType: 'cpf' | 'cnpj' | 'both';
}

const StepThreeDocument: React.FC<StepThreeDocumentProps> = ({ documentType }) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const fileRef = useRef<FileButtonInputRef>(null);

  const selectedDocumentType = watch('documentType');
  const isBillOwner = watch('isBillOwner');
  const dontKnowBillOwnerCpf = watch('dontKnowBillOwnerCpf');
  const billFile = watch('billFile');


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

    if (isOwner) {
      setValue('dontKnowBillOwnerCpf', false);
      setValue('billOwnerCpf', '');
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Preencha os dados da conta de luz.</h2>
        <p className={styles.stepDescription}>Em caso de dúvidas, clique aqui.</p>
      </div>
      <div className={styles.radioGroup}>
        {documentType === 'both' && (
          <div style={{ marginBottom: '32px' }}>
            <p className={styles.stepQuestion}>Onde quer economizar? <span className={styles.start}>*</span></p>
            <div className={styles.radioOption}>
              <Button aria-label="Botão para selecionar casa" type="button" variant={selectedDocumentType === 'cpf' ? 'primary' : 'outline'} onClick={() => handleSelectType('cpf')} >Casa</Button>
              <Button aria-label="Botão para selecionar empresa"
                type="button" variant={selectedDocumentType === 'cnpj' ? 'primary' : 'outline'} onClick={() => handleSelectType('cnpj')} >Empresa</Button>
            </div>
          </div>
        )}
        {selectedDocumentType !== 'cnpj' && (
          <>
            <p className={styles.stepQuestion}>A conta de luz está em seu nome? <span className={styles.start}>*</span></p>
            <div className={styles.radioOption}>
              <Button aria-label="Botão sim para caso a conta de luz estiver no nome do cadastrante" type="button" variant={isBillOwner === true ? 'primary' : 'outline'} onClick={() => handleBillOwnerChange(true)}>Sim</Button>
              <Button aria-label="Botão não para caso a conta de luz não esteja no nome do cadastrante" type="button" variant={isBillOwner === false ? 'primary' : 'outline'} onClick={() => handleBillOwnerChange(false)}>Não</Button>
            </div>
            {errors.isBillOwner && <p className={styles.errorMessage}>{errors.isBillOwner.message as string}</p>}
          </>
        )}

      </div>
      <div className={styles.stepContent}>
        {selectedDocumentType === 'cpf' && (
          <>
            {dontKnowBillOwnerCpf === false && isBillOwner === true &&

              <div className={styles.inputMyCpfContainer}>
                <Input aria-label="Inserir cpf do cadastrante" {...register('myCpf')} label="Meu CPF *" placeholder="000.000.000-00" errorMessage={errors.myCpf?.message as string} fullWidth />
              </div>
            }

            {isBillOwner === false && (
              <>
                {dontKnowBillOwnerCpf ? (
                  <div className={styles.inputFileContainer}>
                    <p className={styles.titleFileInput}>Conta de luz atual <span className={styles.start}>*</span></p>
                    {billFile && billFile.length > 0 && <hr className={styles.lineFileInput} />}
                    <FileButtonInput
                      {...register('billFile')}
                      aria-label="Botão para enviar conta de luz"
                      ref={fileRef}
                      buttonText="Enviar conta de luz"
                      accept="image/*,application/pdf"
                      errorMessage={errors.billFile?.message as string}
                      fullWidth
                      onChange={(e) => {
                        setValue('billFile', e.target.files?.length ? e.target.files : undefined, { shouldValidate: true });
                      }}
                    />
                  </div>
                ) : (
                  <div className={styles.containerInputOwnerCpf}>
                    <Input aria-label="Inserir cpf do titular da conta" {...register('billOwnerCpf')} label="CPF do titular da conta de luz" placeholder="000.000.000-00" errorMessage={errors.billOwnerCpf?.message as string} fullWidth />
                  </div>
                )}
                <div className={styles.toggleContainer}>
                  <Toggle
                    aria-label="Alternar para não sei o cpf do titular da conta"
                    id="dontKnowCpf"
                    checked={dontKnowBillOwnerCpf || false}
                    onChange={(checked) => setValue('dontKnowBillOwnerCpf', checked, { shouldValidate: true })}
                    label="Não sei o CPF do titular da conta."
                    onColor="#08068D"
                    offColor="#ccc"
                  />
                </div>
              </>
            )}
          </>
        )}
        {selectedDocumentType === 'cnpj' && (
          <Input aria-label="Inserir CNPJ do titular da conta" {...register('cnpj')} label="CNPJ do titular da conta de luz" placeholder="00.000.000/0000-00" errorMessage={errors.cnpj?.message as string} fullWidth />
        )}
      </div>
    </div>
  );
};

export default StepThreeDocument;