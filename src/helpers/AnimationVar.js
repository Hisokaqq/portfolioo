const delay1 = .3;
const delay2 = 4
const delay3 = 2

export const BoxAnimation = {
    hidden: {
        scale: 1.03,
    },
    show: {
        scale: 0,
        transition: {
            duration: 1.5,
            ease: "easeOut",
            delay: delay1,
           
        },
    },
};

export const moveAnimation = {
    hidden: {
        scale: .2,
        x: 5,
        y: 1,
        rotateY: 2,
        
    },
    show: {
        x: 0,
        y: 0,
        rotateY: 0,
        scale: 1,
        transition: {
            duration: 2,
            ease: "easeOut",
            when: "beforeChildren",
            rotateY: { delay: delay3, duration: .5 },
            scale: { delay: delay3 + .5 },
        },
    },
    
};

const htmlDelay = 4

export const parentAnimation = {
    hidden: { },
    show: {
      transition: {
        staggerChildren: .3,
        when: "beforeChildren",
        delayChildren: htmlDelay,
        duration: 0,
      }
    }
  };
  
  export const firstnameAnimation = {
    hidden: { y: 300 },
    show: { y: 0,
      transition: {
        duration : 1,
      } }
  };
  

  export const simpleAnimation = {
    hidden: { opacity: 0 },
    show: { opacity: 1,
        transition: {
            duration : 1,
            delay: htmlDelay
          }
    },
  
  }