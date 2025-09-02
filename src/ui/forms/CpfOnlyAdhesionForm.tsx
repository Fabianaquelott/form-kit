// src/ui/forms/CpfOnlyAdhesionForm.tsx
import React from 'react';
import { DefaultAdhesionForm, DefaultAdhesionFormProps } from '../DefaultAdhesionForm';
import { FlowConfig } from '@/core';

const cpfOnlyFlowConfig: FlowConfig = {
  steps: [1, 2, 3, 4, 5],
  documentType: 'cpf',
};

export const CpfOnlyAdhesionForm: React.FC<DefaultAdhesionFormProps> = (props) => {
  return <DefaultAdhesionForm {...props} flowConfig={cpfOnlyFlowConfig} />;
};