import React, { useEffect, useState } from 'react';
import Btn from './Btn';
import Magnetic from './Magnetic';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import  {AiOutlineCopy} from 'react-icons/ai'

const Contact = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });

  const [copiedPhoneNumber, setCopiedPhoneNumber] = useState(false);
  const [copiedEmailAddress, setCopiedEmailAddress] = useState(false);

  const handleCopyPhoneNumber = () => {
    setCopiedPhoneNumber(true);
    setTimeout(() => setCopiedPhoneNumber(false), 1500); // Reset the copied state after 1.5 seconds
  };

  const handleCopyEmailAddress = () => {
    setCopiedEmailAddress(true);
    setTimeout(() => setCopiedEmailAddress(false), 1500); // Reset the copied state after 1.5 seconds
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div className="h-[30vh] w-full flex items-center justify-center relative">
      <div className="md:w-[70%] w-[90%] ">
        <motion.h1 className="lg:text-4xl text-xsm">Let's work together</motion.h1>
        <div className="relative">
          <div className="relative overflow-hidden">
            <motion.div
              animate={inView ? { opacity: 1, x: 0 } : { x: '-300%' }}
              transition={{ duration: 0.4 }}
              className="w-full h-[2px] bg-gray-400"
            ></motion.div>
          </div>
          <motion.div
            ref={ref}
            animate={inView ? { opacity: 1, x: isMobile ? 50 : 0  } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div className="w-32 h-32 absolute right-0 top-[-50%] translate-y-[-60%] ">
              <Btn>
                <p>Get in touch</p>
              </Btn>
            </motion.div>
          </motion.div>
        </div>
        <motion.div className="flex-col lg:flex gap-1 mt-5">
          <CopyToClipboard text="+43 660 7890132" onCopy={handleCopyPhoneNumber}>
            <div
              className={`cursor-pointer text-sm relative w-fit flex gap-1`}
            >
              <p className='hover:text-gray-500 transition-all duration-200'>+43 660 7890132</p>
              <AiOutlineCopy className="mt-[3px]"/>
              <AnimatePresence>
              {copiedPhoneNumber && (
                <motion.div
                  className={`w-full h-[2px] bg-red-400 absolute bottom-0 left-0`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                ></motion.div>
              )}
              </AnimatePresence>
            </div>
          </CopyToClipboard>

          <CopyToClipboard text="burtynoleksandr@gmail.com" onCopy={handleCopyEmailAddress}>
            <div
              className={` cursor-pointer text-sm relative w-fit flex gap-1`}
            >
              <p className='hover:text-gray-500 transition-all duration-200'>burtynoleksandr@gmail.com</p>
            <AiOutlineCopy className="mt-[3px]"/>
              <AnimatePresence>
              {copiedEmailAddress && (
                <motion.div
                  className={`w-full h-[2px]  bg-red-400 absolute bottom-0 left-0`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ opacity: 0 }}
                ></motion.div>
              )}
              </AnimatePresence>
            </div>
          </CopyToClipboard>
        </motion.div>
      </div>
      <div className="w-full h-10 absolute bottom-0 px-8 py-0 flex flex-row-reverse gap-5">
        <Magnetic>
          <p
            className="text-sm cursor-pointer"
            onClick={() => window.open('https://www.instagram.com/hisokaxix/')}
          >
            Instagram
          </p>
        </Magnetic>
        <Magnetic>
          <p
            className="text-sm cursor-pointer"
            onClick={() => window.open('https://www.linkedin.com/in/alexandr-burtyn-397534266/')}
          >
            Github
          </p>
        </Magnetic>
        <Magnetic>
          <p
            className="text-sm cursor-pointer"
            onClick={() => window.open('https://github.com/Hisokaqq')}
          >
            LinkedIn
          </p>
        </Magnetic>
      </div>
    </motion.div>
  );
};

export default Contact;