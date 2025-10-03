import api from './client'

export function sendContactMessage(payload) {
  // Expected payload: { name, email, subject, message, to }
  return api.post('/contact', payload)
}

