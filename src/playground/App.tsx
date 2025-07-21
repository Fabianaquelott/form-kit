// src/playground/App.tsx

import React, { useState } from 'react';
import {
  DefaultAdhesionForm,
  CpfOnlyAdhesionForm,
  CnpjOnlyAdhesionForm,
  NoSmsAdhesionForm,
  QuickCaptureAdhesionForm,
  DefaultAdhesionFormProps
} from '@/ui';
import './App.css';

type FormVariant = 'default' | 'cpfOnly' | 'cnpjOnly' | 'noSms' | 'quickCapture';

const formComponents: Record<FormVariant, React.FC<DefaultAdhesionFormProps>> = {
  default: DefaultAdhesionForm,
  cpfOnly: CpfOnlyAdhesionForm,
  cnpjOnly: CnpjOnlyAdhesionForm,
  noSms: NoSmsAdhesionForm,
  quickCapture: QuickCaptureAdhesionForm,
};

const formTitles: Record<FormVariant, string> = {
  default: 'Fluxo Padrão Completo',
  cpfOnly: 'Fluxo Apenas CPF',
  cnpjOnly: 'Fluxo Apenas CNPJ',
  noSms: 'Fluxo Sem Etapa de SMS',
  quickCapture: 'Fluxo de Captura Rápida',
};


function App() {
  const [activeForm, setActiveForm] = useState<FormVariant>('default');

  const handleSuccess = (data: any) => {
    console.log(`✅ Sucesso no fluxo "${formTitles[activeForm]}":`, data);
    alert('Sucesso! Veja o console.');
  };

  const handleError = (error: string) => {
    console.error(`❌ Erro no fluxo "${formTitles[activeForm]}":`, error);
  };

  const ActiveFormComponent = formComponents[activeForm];

  return (
    <div className="playground-container">
      <header className="playground-header">
        <h1>Bulbe Form Kit - Playground</h1>
        <p>Selecione uma variação do formulário para testar:</p>
        <nav className="form-selector">
          {Object.keys(formComponents).map((key) => (
            <button
              key={key}
              className={activeForm === key ? 'active' : ''}
              onClick={() => setActiveForm(key as FormVariant)}
            >
              {formTitles[key as FormVariant]}
            </button>
          ))}
        </nav>
      </header>

      <main className="playground-main">
        <ActiveFormComponent
          key={activeForm}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </main>
    </div>
  );
}

export default App;