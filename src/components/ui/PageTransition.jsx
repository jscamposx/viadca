import { motion } from 'framer-motion'

const PageTransition = ({ children, className = "", animationType = "fade-up" }) => {
  const animations = {
    "fade-up": {
      initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
      },
      enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          when: "beforeChildren",
          staggerChildren: 0.1
        }
      },
      exit: {
        opacity: 0,
        y: -20,
        scale: 1.02,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    "slide-right": {
      initial: {
        opacity: 0,
        x: -50,
        scale: 0.98
      },
      enter: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
          when: "beforeChildren",
          staggerChildren: 0.1
        }
      },
      exit: {
        opacity: 0,
        x: 50,
        scale: 0.98,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    },
    "zoom": {
      initial: {
        opacity: 0,
        scale: 0.9
      },
      enter: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          when: "beforeChildren",
          staggerChildren: 0.1
        }
      },
      exit: {
        opacity: 0,
        scale: 1.1,
        transition: {
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }
  }

  const pageVariants = animations[animationType] || animations["fade-up"]

  const childVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      style={{ willChange: 'transform, opacity' }}
    >
      <motion.div variants={childVariants}>
        {children}
      </motion.div>
    </motion.div>
  )
}

export default PageTransition
