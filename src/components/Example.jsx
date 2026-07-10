import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

// Lowered so a normal flick advances the image (10000 required a hard swipe).
const swipeConfidenceThreshold = 5000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Example = ({images}) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = wrap(0, images.length, page);
  const hasMultiple = images.length > 1;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // Arrow-key navigation.
  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") paginate(1);
      else if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={images[imageIndex]}
          alt={`Project screenshot ${imageIndex + 1} of ${images.length}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag={hasMultiple ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>

      {hasMultiple && (
        <>
          <button type="button" aria-label="Next image" className="next" onClick={() => paginate(1)}>
            {"›"}
          </button>
          <button type="button" aria-label="Previous image" className="prev" onClick={() => paginate(-1)}>
            {"‹"}
          </button>

          {/* Position indicator */}
          <div className="slideshow-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === imageIndex ? "dot-active" : ""}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Example;
