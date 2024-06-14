import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'virtual:register-svg-icons'
import names from 'virtual:svg-icons-names'
import { addCollection } from '@iconify/react'
import fa from '@iconify/json/json/fa.json'
addCollection(fa)
console.log(names)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
