import React from 'react'
import { RequestForm } from './components/RequestForm'
import { C } from './lib/constants'
import './index.css' // Import standard Vite CSS

function App() {
  return (
    <div style={{ minHeight: '100vh', background: C.bgPage, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <RequestForm />
    </div>
  )
}

export default App
