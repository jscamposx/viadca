import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const AnimatedLayout = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <div key={location.pathname}>{children}</div>
    </AnimatePresence>
  );
};

export default AnimatedLayout;
