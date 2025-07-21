/* import React from 'react';
import { DefaultAdhesionForm } from '../ui/DefaultAdhesionForm';

function App() {
  const handleSuccess = (data: any) => {
    console.log('🎉 Adesão concluída com sucesso!', data);
    alert('Adesão realizada com sucesso!');
  };

  const handleError = (error: string) => {
    console.error('❌ Erro na adesão:', error);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Adhesion Form Lib - Playground</h1>
        <p>Ambiente de desenvolvimento para testar a biblioteca</p>
      </div>

      <main>
        <DefaultAdhesionForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </main>
    </div>
  );
}

export default App; */




/* import { CpfOnlyAdhesionForm } from '@/ui'
import './App.css'

function App() {
  const handleSuccess = (data: any) => {
    console.log('✅ Adesão CPF-Only com Sucesso:', data);
    alert('Sucesso! Veja o console.');
  };

  const handleError = (error: string) => {
    console.error('❌ Erro na Adesão CPF-Only:', error);
  };

  return (
    <div className="app-container">
      <CpfOnlyAdhesionForm
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}

export default App */



import { CnpjOnlyAdhesionForm } from '@/ui'
import './App.css'

function App() {
  const handleSuccess = (data: any) => {
    console.log('✅ Adesão CNPJ-Only com Sucesso:', data);
    alert('Sucesso! Veja o console.');
  };

  const handleError = (error: string) => {
    console.error('❌ Erro na Adesão CNPJ-Only:', error);
  };

  return (
    <div className="app-container">
      <CnpjOnlyAdhesionForm
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}

export default App



/* import { NoSmsAdhesionForm } from '@/ui'
import './App.css'

function App() {
  const handleSuccess = (data: any) => {
    console.log('✅ Adesão Sem SMS com Sucesso:', data);
    alert('Sucesso! Veja o console.');
  };

  const handleError = (error: string) => {
    console.error('❌ Erro na Adesão Sem SMS:', error);
  };

  return (
    <div className="app-container">
      <NoSmsAdhesionForm
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}

export default App */



/* import { QuickCaptureAdhesionForm } from '@/ui'
import './App.css'

function App() {
  const handleSuccess = (data: any) => {
    console.log('✅ Captura Rápida com Sucesso:', data);
    alert('Sucesso! Veja o console.');
  };

  const handleError = (error: string) => {
    console.error('❌ Erro na Captura Rápida:', error);
  };

  return (
    <div className="app-container">
      <QuickCaptureAdhesionForm
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
}

export default App */