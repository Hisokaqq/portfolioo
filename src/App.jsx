
import './App.css'
import Experience from './pages/Experience'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Projects from './pages/Projects'
import Me_contact from './pages/Me_contact'
import SingleProject from './pages/SingleProject'
import NotFound from './pages/NotFound'
import CustomCursor from './components/CustomCursor'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './helpers/ThemeContext'
import { MorphProvider } from './helpers/MorphContext'

function App() {
  const location = useLocation();
  return (
    <ThemeProvider>
    <MorphProvider>
    <main className="app h-[100dvh] w-[100%]">
      <CustomCursor />
      <ThemeToggle />
      <AnimatePresence mode={ "wait"}>

      <Routes location={ location} key={location.pathname}>

      <Route
            path="/"
            element={<Experience  />}
          />
      <Route
            path="/me"
            element={<Me_contact />}
          />    
       <Route
            path="/projects"
            element={<Projects  />}
          /> 
       <Route
            path="/projects/project/:id"
            element={<SingleProject />} />
      <Route
            path="*"
            element={<NotFound />}
          />
      </Routes>
      </AnimatePresence>
    </main>
    </MorphProvider>
    </ThemeProvider>
  )
}
export default App
