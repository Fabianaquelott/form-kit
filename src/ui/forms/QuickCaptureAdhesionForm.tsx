// src/ui/forms/QuickCaptureAdhesionForm.tsx
import React from 'react';
import { DefaultAdhesionForm, DefaultAdhesionFormProps } from '../DefaultAdhesionForm';
import { FlowConfig } from '@/core';

const quickCaptureFlowConfig: FlowConfig = {
  steps: [1, 5], // Pula para a conclusão
  requiresSms: false,
};

export const QuickCaptureAdhesionForm: React.FC<DefaultAdhesionFormProps> = (props) => {
  return <DefaultAdhesionForm {...props} flowConfig={quickCaptureFlowConfig} />;
};