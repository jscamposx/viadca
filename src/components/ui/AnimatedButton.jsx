import { motion } from "framer-motion";

const AnimatedButton = ({
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  ...props
}) => {
  const variants = {
    primary: {
      hover: {
        scale: 1.02,
        y: -2,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 },
      },
    },
    secondary: {
      hover: {
        scale: 1.01,
        borderColor: "rgba(99, 102, 241, 0.4)",
        backgroundColor: "rgba(99, 102, 241, 0.05)",
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.99,
        transition: { duration: 0.1 },
      },
    },
  };

  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      variants={variants[variant]}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "tap"}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
