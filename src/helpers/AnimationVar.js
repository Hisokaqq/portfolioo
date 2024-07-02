const delay = 2

export const moveAnimation = {
    hidden: {
        scale: .2,
        x: 30,
        rotateY: 2,
    },
    show: {
        x: 0,
        rotateY: 0,
        scale: 1,
        transition: {
            duration: 2,
            ease: "easeOut",
            when: "beforeChildren",
            rotateY: { delay: delay, duration: .5 },
            scale: { delay: delay + .5 },
        },
    },
};
export const moveAnimationPhone = {
    hidden: {
        scale: .5,
        x: 20,
        rotateY: 2,
    },
    show: {
        rotateY: 0,
        x: 3,
        scale: 1,
        transition: {
            duration: 2,
            ease: "easeOut",
            when: "beforeChildren",
            rotateY: { delay: delay, duration: .5 },
            scale: { delay: delay + .5 },
        },
    },
};

const htmlDelay = 2

export const parentAnimation = {
    hidden: { },
    show: {
      transition: {
        staggerChildren: .3,
        when: "beforeChildren",
        delayChildren: htmlDelay,
        duration: 0,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 100,
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

export const SkilContAnimation = {
  hidden:{
    opacity: 0,
  },
  show:{
    opacity: 1,
    transition: {
      staggerChildren: .05,
      when: "beforeChildren",
      delayChildren: .1,
    }
  }
}

export const SkilAnimation = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1,
    transition: { duration: .3 }
  }
};

export const SkilNameAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1,
    transition: { duration: .3 }
  }
};

export const AboutMeAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1,
    transition: { 
      duration: .7,
      delay: .5
     }
  }
};