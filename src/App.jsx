
import './App.css'
import Experience from './pages/Experience'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Projects from './pages/Projects'
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
            element={<Projects />}
          />    
       <Route
            path="/projects"
            element={<Projects  />}
          /> 
    
      </Routes>
      </AnimatePresence>
      
    </div>
  )
}
export default App
