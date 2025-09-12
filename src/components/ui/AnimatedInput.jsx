import { motion } from "framer-motion";

const AnimatedInput = ({
  label,
  error,
  icon: Icon,
  className = "",
  delay = 0,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="w-full"
    >
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {Icon && (
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
        <motion.input
          className={`${className} transition-all duration-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
          whileFocus={{
            scale: 1.01,
            transition: { duration: 0.2 },
          }}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          className="text-red-600 text-sm mt-2 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default AnimatedInput;
