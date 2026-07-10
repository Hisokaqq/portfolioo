import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
      exit={{ opacity: 0 }}
      className="h-[100dvh] w-full flex flex-col items-center justify-center gap-4"
    >
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="text-lg">This page doesn&apos;t exist.</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="font-bold text-lg hover:text-gray-500 duration-300 cursor-pointer bg-transparent border-0"
      >
        Go Home
      </button>
    </motion.div>
  );
};

export default NotFound;
