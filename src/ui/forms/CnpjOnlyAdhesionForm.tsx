// src/ui/forms/CnpjOnlyAdhesionForm.tsx
import React from 'react';
import { DefaultAdhesionForm, DefaultAdhesionFormProps } from '../DefaultAdhesionForm';
import { FlowConfig } from '@/core';

const cnpjOnlyFlowConfig: FlowConfig = {
  steps: [1, 2, 3, 4, 5],
  documentType: 'cnpj',
};

export const CnpjOnlyAdhesionForm: React.FC<DefaultAdhesionFormProps> = (props) => {
  return <DefaultAdhesionForm {...props} flowConfig={cnpjOnlyFlowConfig} />;
};