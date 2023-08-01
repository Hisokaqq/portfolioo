import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import HtmlPart from './components/HtmlPart.jsx'
import Loader from './components/Loader.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loader/>}>
      <App/>
    </Suspense>

  </React.StrictMode>,
)
