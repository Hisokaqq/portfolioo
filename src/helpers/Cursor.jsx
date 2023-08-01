import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = ({cursorVariant, setCursorVariant}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    },
    text: {
      height: 150,
      width: 150,
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      backgroundColor: "red",
      mixBlendMode: 'difference',
    },
  };



  // Get the width of the iPhone 14 Pro Plus (or any other desired threshold)
  const iPhone14ProPlusWidth = 428;

  // Check if the screen width is smaller than the iPhone 14 Pro Plus
  if (window.innerWidth < iPhone14ProPlusWidth) {
    return null;
  }

  return (
    <motion.div
      variants={variants}
      animate={cursorVariant}
      className="w-8 h-8 rounded-full border-black border-2 z-50 fixed left-0 top-0"
    ></motion.div>
  );
};

export default Cursor;
