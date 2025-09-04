// src/utils/metrics.ts
export const trackPageView = async () => {
  if (import.meta.env.PROD) {
    try {
      await fetch('http://localhost:3001/track-page-view', { method: 'POST' })
    } catch (err) {
      console.error('Erro ao enviar métrica', err)
    }
  }
}

export const trackUserCreated = async () => {
  if (import.meta.env.PROD) {
    try {
      await fetch('http://localhost:3001/track-user-created', { method: 'POST' })
    } catch (err) {
      console.error('Erro ao enviar métrica', err)
    }
  }
}

export const trackStep2Success = async () => {
  if (import.meta.env.PROD) {
    try {
      await fetch('http://localhost:3001/track-step2-success', { method: 'POST' })
    } catch (err) {
      console.error('Erro ao enviar métrica', err)
    }
  }
}
