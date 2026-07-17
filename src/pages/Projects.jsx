import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrthographicCamera, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { VscGithubAlt } from 'react-icons/vsc'
import { SiVercel } from 'react-icons/si'
import Env from '../components/Env'
import GBackBtn from '../components/GBackBtn'
import projects from '../components/projects'
import { pageVariants, GalleryListAnimation, GalleryRowAnimation } from '../helpers/AnimationVar'
import { useTheme } from '../helpers/ThemeContext'
import { useMorph } from '../helpers/MorphContext'
import useIsMobile from '../helpers/useIsMobile'
import previewVertexShader from '../helpers/previewVertexShader'
import previewFragmentShader from '../helpers/previewFragmentShader'

// Fixed size of the floating preview — used both for the actual box (inline
// style below) and to compute the morph's start rect from the cursor position,
// so we never depend on reading a DOM rect that may be mid-crossfade.
const PREVIEW_W = 320
const PREVIEW_H = 200

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

// How close the cursor has to be (in px, from a title's center) before it
// starts pulling that title toward it — falls off linearly to 0 at this
// radius, so titles the cursor isn't near stay put.
const MAGNETIC_RADIUS = 260

const aspectOf = (texture) => texture.image.width / texture.image.height

// Deliberately much softer than CustomCursor's ring (stiffness 350/damping
// 28) — that spring is tuned to visibly catch up to a *large*, fast-moving
// target (the cursor), so it settles in a couple of frames. The magnetic
// lean's target only ever moves a few px / a fraction of a scale unit, so
// the same kind of spring would appear to "snap" almost immediately just
// because there's so little distance left to close. Lower stiffness keeps
// the motion visibly gliding for a couple hundred ms instead.
const MAGNETIC_SPRING = { stiffness: 90, damping: 14, mass: 0.8 }

// Softer/slower than CustomCursor's ring (stiffness 350/damping 28) so the
// floating preview visibly trails the pointer by a beat instead of snapping
// to it 1:1 — reads as the image being "dragged along," which feels less
// twitchy on a large 320x200 box than instant tracking does.
const PREVIEW_SPRING = { stiffness: 170, damping: 24, mass: 0.6 }

function computePull(el, cx, cy) {
  if (!el) return { x: 0, y: 0, scale: 1 }
  const rect = el.getBoundingClientRect()
  const dx = cx - (rect.left + rect.width / 2)
  const dy = cy - (rect.top + rect.height / 2)
  const dist = Math.hypot(dx, dy)
  const pull = Math.max(0, 1 - dist / MAGNETIC_RADIUS)
  return { x: dx * 0.22 * pull, y: dy * 0.16 * pull, scale: 1 + pull * 0.08 }
}

// Leans toward the cursor as it passes nearby, independent of which row is
// "active" — via real spring physics (useSpring), the same technique
// CustomCursor's ring/dot already use, rather than a fixed-duration CSS
// transition retargeted on every mousemove. That CSS-transition version
// technically never got stuck, but its easing curve restarted fresh on every
// single retarget, which read as an abrupt snap each time the pull kicked in
// or a title crossed the radius boundary. A spring MotionValue instead
// integrates continuously frame to frame, so rapid retargeting blends into
// one smooth motion instead of a series of little snaps.
function MagneticTitle({ cursorX, cursorY, className, children }) {
  const ref = useRef(null)
  const rawX = useTransform([cursorX, cursorY], ([cx, cy]) => computePull(ref.current, cx, cy).x)
  const rawY = useTransform([cursorX, cursorY], ([cx, cy]) => computePull(ref.current, cx, cy).y)
  const rawScale = useTransform([cursorX, cursorY], ([cx, cy]) => computePull(ref.current, cx, cy).scale)
  const springX = useSpring(rawX, MAGNETIC_SPRING)
  const springY = useSpring(rawY, MAGNETIC_SPRING)
  const springScale = useSpring(rawScale, MAGNETIC_SPRING)

  return (
    <motion.span ref={ref} className={className} style={{ x: springX, y: springY, scale: springScale }}>
      {children}
    </motion.span>
  )
}

// A single always-mounted shader plane crossfades between whichever two
// project textures are the current "from"/"to" — no per-hover mount/unmount,
// same lesson as the CSS-crossfade version this replaces: state is re-derived
// fresh every frame from a plain ref (activeIndexRef), so no matter how fast
// hoveredId churns there's no imperative "start/stop" step that can desync
// and get stuck (the earlier AnimatePresence/framer-motion `animate` bugs).
function PreviewPlane({ activeIndexRef }) {
  const textures = useTexture(projects.map((p) => p.images[0]))
  const materialRef = useRef()
  const transitionRef = useRef({ fromIndex: 0, toIndex: 0, prevTarget: -1 })

  useEffect(() => {
    textures.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace })
  }, [textures])

  const uniforms = useMemo(() => ({
    u_from: { value: textures[0] },
    u_to: { value: textures[0] },
    u_progress: { value: 0 },
    u_time: { value: 0 },
    u_boxAspect: { value: PREVIEW_W / PREVIEW_H },
    u_fromAspect: { value: aspectOf(textures[0]) },
    u_toAspect: { value: aspectOf(textures[0]) },
    // textures is stable for the component's lifetime (useTexture returns a
    // fixed array), so this only ever needs to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  useFrame((_, delta) => {
    const mat = materialRef.current
    if (!mat) return
    const u = mat.uniforms
    const target = activeIndexRef.current
    const s = transitionRef.current

    // A genuinely new target (including "back to whatever we were fading
    // from") restarts the dissolve from 0 — retargeting mid-flight just
    // means the noise wipe restarts, it can never get stuck mid-way. The one
    // exception: if the preview was hidden a moment ago (prevTarget === -1),
    // there's nothing on screen to dissolve *from* yet — snap straight to the
    // target instead of animating in from whatever project happened to be
    // cached last, which otherwise flashes as a "wrong" image under the
    // fade-in.
    if (target !== -1 && target !== s.toIndex) {
      const cameFromHidden = s.prevTarget === -1
      s.fromIndex = cameFromHidden ? target : s.toIndex
      s.toIndex = target
      u.u_from.value = textures[s.fromIndex]
      u.u_to.value = textures[s.toIndex]
      u.u_fromAspect.value = aspectOf(textures[s.fromIndex])
      u.u_toAspect.value = aspectOf(textures[s.toIndex])
      u.u_progress.value = cameFromHidden ? 1 : 0
    }
    s.prevTarget = target

    u.u_time.value += delta
    easing.damp(u.u_progress, 'value', 1, 0.25, delta)
  })

  return (
    <mesh>
      <planeGeometry args={[PREVIEW_W, PREVIEW_H]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={previewVertexShader}
        fragmentShader={previewFragmentShader}
      />
    </mesh>
  )
}

// Show/hide is a spring-driven `animate` (React-state-driven, not per-frame,
// so it's a discrete boolean toggle rather than the rapidly-retargeted case
// that broke framer-motion's `animate` earlier) — matches CustomCursor's own
// opacity spring rather than a CSS ease-out, which snapped in abruptly. The
// shader plane itself never fades, it just keeps whatever it last showed, so
// reappearing after a hover gap dissolves cleanly from the last image
// instead of popping in from black.
function HoverPreviewGL({ visible, x, y, activeIndexRef }) {
  return (
    <motion.div
      className="gallery-preview"
      style={{ x, y, width: PREVIEW_W, height: PREVIEW_H }}
    >
      <motion.div
        className="gallery-preview-frame absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Canvas dpr={[1, 2]} gl={{ alpha: false, antialias: true, depth: false, stencil: false }}>
          <OrthographicCamera
            makeDefault
            left={-PREVIEW_W / 2}
            right={PREVIEW_W / 2}
            top={PREVIEW_H / 2}
            bottom={-PREVIEW_H / 2}
            near={0.1}
            far={10}
            position={[0, 0, 1]}
          />
          <Suspense fallback={null}>
            <PreviewPlane activeIndexRef={activeIndexRef} />
          </Suspense>
        </Canvas>
      </motion.div>
    </motion.div>
  )
}

const Projects = () => {
  const navigate = useNavigate()
  const [perfSucks] = useState(false)
  const { theme } = useTheme()
  const { startMorph } = useMorph()
  const isMobile = useIsMobile()

  const [hoveredId, setHoveredId] = useState(null)
  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  // The preview box tracks a *separate* position from x/y. x/y get snapped
  // to -9999 on mouse-leave so the magnetic title pull relaxes (see the
  // onMouseLeave handler below) — but the preview spring was chasing that
  // same -9999 jump, which made the box visibly dart toward the top-left
  // corner while its opacity was fading out. previewSource only ever holds
  // real on-screen positions, so hiding the preview just fades it in place.
  const previewSourceX = useMotionValue(-9999)
  const previewSourceY = useMotionValue(-9999)
  const previewX = useSpring(previewSourceX, PREVIEW_SPRING)
  const previewY = useSpring(previewSourceY, PREVIEW_SPRING)
  const rowRefs = useRef({})
  const thumbRefs = useRef({})
  const washRef = useRef(null)
  const activeIndexRef = useRef(-1)
  const hoverClearTimeoutRef = useRef(null)
  const hoveredProject = projects.find((p) => p.id === hoveredId) ?? null

  // While a row preview is showing, it visually replaces the custom cursor —
  // suppress the ring/dot the same way the command palette does (App.css).
  const wasVisibleRef = useRef(false)
  useEffect(() => {
    document.body.classList.toggle('gallery-preview-active', hoveredId !== null)
    activeIndexRef.current = hoveredId === null ? -1 : projects.findIndex((p) => p.id === hoveredId)
    // Reappearing from fully hidden — snap the lag-spring straight to the
    // current cursor position instead of letting it spring in from wherever
    // it last was (often the -9999 off-screen reset, or a stale far-away
    // spot). Without this the very first reveal visibly flies in from the
    // top-left corner instead of just fading in in place.
    if (hoveredId !== null && !wasVisibleRef.current) {
      previewX.jump(previewSourceX.get())
      previewY.jump(previewSourceY.get())
    }
    wasVisibleRef.current = hoveredId !== null
    return () => document.body.classList.remove('gallery-preview-active')
  }, [hoveredId, previewX, previewY, previewSourceX, previewSourceY])

  // Direct style write (not React state) so the Houdini custom-property
  // transition in App.css drives the color interpolation itself — this only
  // needs to fire when the hovered row actually changes, same as the body
  // class above.
  useEffect(() => {
    washRef.current?.style.setProperty('--gallery-accent', hoveredProject?.accent ?? 'transparent')
  }, [hoveredProject])

  useEffect(() => () => {
    if (hoverClearTimeoutRef.current) clearTimeout(hoverClearTimeoutRef.current)
  }, [])

  const goBack = () => navigate('/')

  // Authoritative on every mousemove tick: recompute which row (if any) is
  // actually under the cursor from the real DOM target, rather than trusting
  // discrete per-row mouseenter/mouseleave events. Fast mouse movement can
  // fire those out of order (leave one row a tick after entering the next,
  // or drop one at the edge of the list entirely), which left the preview
  // "stuck" on a stale row — this self-corrects every single move regardless.
  const handleContainerMouseMove = (e) => {
    x.set(e.clientX)
    y.set(e.clientY)
    previewSourceX.set(e.clientX)
    previewSourceY.set(e.clientY)
    const rowLink = e.target.closest('.gallery-row-link')
    const id = rowLink ? Number(rowLink.dataset.projectId) : null
    if (id !== null) {
      // Landed on a real row-link — cancel any pending "hide" from a moment
      // ago (see below) and switch immediately, no debounce on the way in.
      if (hoverClearTimeoutRef.current) {
        clearTimeout(hoverClearTimeoutRef.current)
        hoverClearTimeoutRef.current = null
      }
      setHoveredId((current) => (current === id ? current : id))
    } else if (!hoverClearTimeoutRef.current) {
      // A fast mouse crossing between two adjacent rows can land a mousemove
      // sample on the thin non-link sliver between them (the row border, the
      // gap before the icons) for a single frame — clearing hoveredId
      // instantly there flashed the real cursor back on for a moment before
      // the next sample re-hid it. Give it a brief grace period: only if
      // nothing else claims the hover within it does this actually count as
      // "left the row" rather than "just passing between two rows."
      hoverClearTimeoutRef.current = setTimeout(() => {
        hoverClearTimeoutRef.current = null
        setHoveredId(null)
      }, 60)
    }
  }

  // Keyboard focus has no cursor position to follow, so anchor the preview
  // beside the focused row instead (clamped to stay fully on-screen). The
  // magnetic title lean is a cursor-proximity effect only — keyboard focus
  // still gets the preview image and the existing color highlight.
  //
  // A mouse click *also* fires a native focus event on the link (browsers
  // focus the target on mousedown), which otherwise clobbered x/y with this
  // anchored position right before the click handler read it for the morph
  // rect — the preview would jump to the row's edge for a frame before the
  // morph started expanding from there instead of from the cursor. Gate on
  // :focus-visible so this only runs for real keyboard navigation.
  const handleFocus = (e, project) => {
    if (e.target.matches(':focus-visible')) {
      const rect = rowRefs.current[project.id]?.getBoundingClientRect()
      if (rect) {
        const anchorX = clamp(rect.right + 60, PREVIEW_W / 2 + 16, window.innerWidth - PREVIEW_W / 2 - 16)
        const anchorY = clamp(rect.top + rect.height / 2, PREVIEW_H / 2 + 16, window.innerHeight - PREVIEW_H / 2 - 16)
        x.set(anchorX)
        y.set(anchorY)
        previewSourceX.set(anchorX)
        previewSourceY.set(anchorY)
      }
    }
    setHoveredId(project.id)
  }

  const clearIfCurrent = (id) => setHoveredId((current) => (current === id ? null : current))

  const handleActivate = (project) => {
    if (isMobile) {
      const rect = thumbRefs.current[project.id]?.getBoundingClientRect()
      if (rect) startMorph({ url: project.images[0], rect })
      return
    }
    startMorph({
      url: project.images[0],
      // Read the spring-smoothed position, not the raw cursor — the preview
      // box now visibly lags the pointer, so the morph must start from where
      // the image actually is on screen, not from the (already-moved-on)
      // cursor position.
      rect: { left: previewX.get() - PREVIEW_W / 2, top: previewY.get() - PREVIEW_H / 2, width: PREVIEW_W, height: PREVIEW_H },
    })
  }

  return (
    <motion.div className="relative h-[100dvh] w-full overflow-hidden" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <GBackBtn goBack={goBack} />
      <Canvas className="absolute inset-0" eventPrefix="client" camera={{ zoom: 1, fov: 60 }} gl={{ alpha: false, antialias: false, stencil: false, depth: false }} dpr={[1, 2]}>
        <color attach="background" args={[theme === 'dark' ? '#161226' : '#f0f0f0']} />
        <Suspense fallback={null}>
          <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
            <Env perfSucks={perfSucks} theme={theme} accentColor={hoveredProject?.accent ?? null} />
          </group>
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 flex flex-col justify-center px-[8vw] md:px-[10vw]">
        <div ref={washRef} className="gallery-accent-wash" aria-hidden="true" />
        <div className="gallery-scrim" aria-hidden="true" />
        <p className="relative text-xs md:text-sm tracking-[0.2em] uppercase mb-6 md:mb-10 text-[var(--fg)] opacity-70">
          Selected Projects
        </p>
        <motion.ul
          className="relative flex flex-col"
          variants={GalleryListAnimation}
          initial="hidden"
          animate="show"
          onMouseMove={!isMobile ? handleContainerMouseMove : undefined}
          onMouseLeave={!isMobile ? () => {
            if (hoverClearTimeoutRef.current) {
              clearTimeout(hoverClearTimeoutRef.current)
              hoverClearTimeoutRef.current = null
            }
            setHoveredId(null)
            // Titles derive their magnetic pull from cursorX/cursorY directly,
            // which otherwise sit frozen at the last in-list position once the
            // mouse leaves — send them off-screen so every title's computed
            // distance goes back to "far away" and relaxes to rest. Deliberately
            // NOT done to previewSourceX/Y (the preview box's own position
            // source) — it just fades out in place instead of springing
            // toward this off-screen point first.
            x.set(-9999)
            y.set(-9999)
          } : undefined}
        >
          {projects.map((project, index) => (
            <motion.li
              key={project.id}
              variants={GalleryRowAnimation}
              className="gallery-row group flex items-center justify-between gap-4 border-t border-[var(--divider)] last:border-b"
            >
              {/* The preview/cursor-suppression only reacts to this link (title +
                  mobile thumbnail), not the icons — moving onto the icons should
                  drop the floating image and hand the cursor back. The title's own
                  highlight is separate (group-hover/group-focus-within, above),
                  and stays lit across the whole row including the icons. */}
              <Link
                ref={(el) => { rowRefs.current[project.id] = el }}
                to={`project/${project.id}`}
                data-project-id={project.id}
                className="gallery-row-link flex items-baseline gap-4 md:gap-8 py-4 md:py-6 flex-1 min-w-0"
                onFocus={(e) => !isMobile && handleFocus(e, project)}
                onBlur={() => !isMobile && clearIfCurrent(project.id)}
                onClick={() => handleActivate(project)}
              >
                <span aria-hidden="true" className="text-sm md:text-base text-[var(--fg)] opacity-50 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {/* Magnetic lean (x/y/scale) is spring-driven from the shared
                    cursor position — only color is left to a CSS transition,
                    so the two never fight over the same `transform` property. */}
                <MagneticTitle
                  cursorX={x}
                  cursorY={y}
                  className="inline-block text-2xl md:text-5xl font-semibold text-[var(--fg)] transition-colors duration-300 ease-out group-hover:text-[var(--fg-strong)] group-focus-within:text-[var(--fg-strong)]"
                >
                  {project.title}
                </MagneticTitle>
                {isMobile && (
                  <img
                    ref={(el) => { thumbRefs.current[project.id] = el }}
                    src={project.images[0]}
                    alt=""
                    aria-hidden="true"
                    className="ml-auto w-20 h-14 object-cover rounded-md"
                  />
                )}
              </Link>
              <span className="flex items-center gap-4 text-lg md:text-xl">
                <a href={project.urlgit} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source on GitHub`} data-cursor className="gallery-icon-link">
                  <VscGithubAlt />
                </a>
                {project.urlvercel && (
                  <a href={project.urlvercel} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} live demo`} data-cursor className="gallery-icon-link">
                    <SiVercel />
                  </a>
                )}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {!isMobile && <HoverPreviewGL visible={hoveredId !== null} x={previewX} y={previewY} activeIndexRef={activeIndexRef} />}
    </motion.div>
  )
}

export default Projects
