import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Note: StrictMode is disabled to prevent Keycloak double initialization
// React 18's StrictMode causes components to mount twice in development
// which conflicts with Keycloak's single initialization requirement
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
