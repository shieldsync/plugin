import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('shield-sync-root')

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App page={root.dataset.page} />
    </React.StrictMode>
  )
}