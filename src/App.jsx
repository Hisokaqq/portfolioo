
import { useState } from 'react'
import './App.css'
import Experience from './components/Experience'
import Cursor from './helpers/Cursor'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import HtmlPart2 from './components/HtmlPart2'
function App() {
  const location = useLocation();
  return (
    <div className="app h-[100vh] w-[100%]">
      
      <AnimatePresence mode={ "wait"}>

      <Routes location={ location} key={location.pathname}>

      <Route
            path="/"
            element={<Experience  />}
          />
      <Route
            path="/me"
            element={<HtmlPart2  />}
          />    
       <Route
            path="/projects"
            element={<HtmlPart2  />}
          /> 
    
      </Routes>
      </AnimatePresence>
      
    </div>
  )
}
export default App
