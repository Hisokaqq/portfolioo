import { Suspense, useCallback, useRef, useState } from "react";
import Env from "../components/Env";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  PerformanceMonitor,
  PresentationControls,
  Scroll,
  ScrollControls,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GBackBtn from "../components/GBackBtn";
import Me from "../components/Me";
import Timeline from "../components/Timeline";
import Contact from "../components/Contact";
import ScrollHint from "../components/ScrollHint";
import { Model } from "../3dmodels/Phone";
import { motion as motion3d } from "framer-motion-3d";
import { moveAnimationPhone, pageVariants } from "../helpers/AnimationVar";
import { useTheme } from "../helpers/ThemeContext";
import useIsMobile from "../helpers/useIsMobile";

const Me_contact = () => {
  const [perfSucks, degrade] = useState(false);
  // The Timeline section has variable height (font wrapping, tag count), so
  // the scroll distance can't be a hardcoded constant like the old `1.3` —
  // it's measured from the actual rendered content and fed back into
  // ScrollControls.
  const [pages, setPages] = useState(2.3);
  const resizeObserverRef = useRef(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);

  const goBack = () => navigate("/");

  // `<Scroll html>` mounts its children into a *separate* react-dom root
  // (see drei's ScrollHtml), which commits after this component's own
  // commit — a regular ref set in a `useEffect`/`useLayoutEffect` here would
  // still read `null`. A callback ref fires whenever that other root attaches
  // the node, whichever tick that happens on.
  const setContentRef = useCallback((el) => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    if (!el) return;

    const measure = () => {
      const next = el.getBoundingClientRect().height / window.innerHeight;
      setPages((prev) => (Math.abs(prev - next) > 0.03 ? next : prev));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    resizeObserverRef.current = ro;
  }, []);

  return (
    <motion.div
      className="h-full w-full"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <GBackBtn goBack={goBack} />
      <Canvas
        shadows
        dpr={[1, perfSucks ? 1 : isMobile ? 1.5 : 2]}
        eventPrefix="client"
        camera={{ position: [20, 0.9, 20], fov: isMobile ? 34 : 26 }}
      >
        <Suspense fallback={null}>
          {/* The phone is heavy and awkward to frame/rotate on a small screen,
              so it's dropped on mobile — the About/Contact content stands alone. */}
          {!isMobile && (
          <motion3d.group
            position={[3, 1, 0]}
            variants={moveAnimationPhone}
            animate="show"
            initial="hidden"
          >
            <Float
              rotationIntensity={3}
              floatingRange={[-0.05, 0.05]}
              speed={1.1}
            >
              <PresentationControls
                global={false}
                config={{ mass: 4, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                speed={5}
                rotation={[0, 0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 2]}
              >
                <Model />
              </PresentationControls>
            </Float>
          </motion3d.group>
          )}
        </Suspense>
        <PerformanceMonitor onDecline={() => degrade(true)} />
        <color
          attach="background"
          args={[theme === "dark" ? "#161226" : "#f0f0f0"]}
        />
        <Suspense fallback={null}>
          <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
            <Env perfSucks={perfSucks} theme={theme} />
          </group>
        </Suspense>
        <ScrollControls
          damping={0.1}
          pages={pages}
          html
          style={{ width: "100%" }}
        >
          <Scroll html style={{ width: "100%" }}>
            <div ref={setContentRef} className="w-full">
              <Me />
              <Timeline />
              <Contact />
            </div>
            <ScrollHint />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </motion.div>
  );
};

export default Me_contact;
