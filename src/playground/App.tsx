import React from 'react';
import { DefaultAdhesionForm } from '../ui/DefaultAdhesionForm';

// CORREÇÃO: As importações de CSS foram movidas para main.tsx.
// O componente continua funcionando pois os estilos são globais.

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

export default App;