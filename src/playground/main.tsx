import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function enableMocking() {
  // Execute o mock apenas em ambiente de desenvolvimento
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  const { worker } = await import('../mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});