import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar os estilos globais primeiro
import '../ui/styles/theme.css';
import './App.css';

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  const { worker } = await import('../mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

// enableMocking().then(() => {
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// });