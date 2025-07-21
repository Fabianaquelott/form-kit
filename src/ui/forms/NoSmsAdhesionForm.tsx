// src/ui/forms/NoSmsAdhesionForm.tsx
import React from 'react';
import { DefaultAdhesionForm, DefaultAdhesionFormProps } from '../DefaultAdhesionForm';
import { FlowConfig } from '@/core';

const noSmsFlowConfig: FlowConfig = {
  steps: [1, 3, 4, 5],
};

export const NoSmsAdhesionForm: React.FC<DefaultAdhesionFormProps> = (props) => {
  return <DefaultAdhesionForm {...props} flowConfig={noSmsFlowConfig} />;
};