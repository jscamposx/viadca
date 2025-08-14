import { motion } from 'framer-motion'

const AnimatedCard = ({ 
  children, 
  className = "", 
  delay = 0,
  variant = "fade-up",
  ...props 
}) => {
  const variants = {
    "fade-up": {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    },
    "scale": {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 }
    },
    "slide-left": {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 }
    },
    "slide-right": {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 }
    }
  }

  const selectedVariant = variants[variant] || variants["fade-up"]

  return (
    <motion.div
      className={className}
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3 }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard
