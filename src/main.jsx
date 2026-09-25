import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import { registrarNotificacionesSuscriber } from './patterns/comunication/notificacionesSuscriber.js'

// Registrar el suscriptor de notificaciones al inicio de la aplicación
registrarNotificacionesSuscriber()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
