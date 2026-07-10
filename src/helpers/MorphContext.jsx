import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Drives the "thumbnail expands into the project" transition. A project
// thumbnail on /projects is a WebGL mesh, so there's no DOM element to morph —
// instead, on click we project the mesh's on-screen rect and hand it here.
// The overlay renders a real <img> at that rect and animates it to fullscreen
// while the destination route fades in underneath, then fades itself out.
//
// NOTE: React context does not cross the react-three-fiber reconciler boundary,
// so `startMorph` must be read at the DOM level (in the page component) and
// passed into the <Canvas> as a prop — never via useMorph() inside the scene.
const MorphContext = createContext({ startMorph: () => {} })

// eslint-disable-next-line react-refresh/only-export-components
export const useMorph = () => useContext(MorphContext)

export const MorphProvider = ({ children }) => {
  const [morph, setMorph] = useState(null) // { url, rect: {left, top, width, height} }
  const startMorph = useCallback((data) => setMorph(data), [])
  const clear = useCallback(() => setMorph(null), [])

  return (
    <MorphContext.Provider value={{ startMorph }}>
      {children}
      <MorphOverlay morph={morph} onDone={clear} />
    </MorphContext.Provider>
  )
}

function MorphOverlay({ morph, onDone }) {
  return (
    <AnimatePresence>
      {morph && (
        <motion.img
          key={morph.url}
          src={morph.url}
          alt=""
          aria-hidden="true"
          className="morph-overlay"
          initial={{
            left: morph.rect.left,
            top: morph.rect.top,
            width: morph.rect.width,
            height: morph.rect.height,
          }}
          animate={{
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          }}
          // Fade out (rather than snap away) so the destination page, which has
          // faded in underneath by now, is revealed smoothly.
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
          onAnimationComplete={() => {
            // Hold at fullscreen briefly so the route underneath finishes
            // mounting, then trigger the exit fade.
            setTimeout(onDone, 220)
          }}
        />
      )}
    </AnimatePresence>
  )
}
