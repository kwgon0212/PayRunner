import { JSX } from "react";
import { motion } from "framer-motion";

type Props = {
  children: JSX.Element;
  hasBottomNav: boolean;
};

const Main = ({ children, hasBottomNav }: Props) => {
  return (
    <motion.main
      initial={{ x: 200, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.1, ease: "linear" }}
      className={`absolute bg-white top-16 ${
        hasBottomNav ? "bottom-[80px]" : "bottom-0"
      } w-full overflow-y-auto overflow-x-hidden scrollbar-hidden`}
    >
      {children}
    </motion.main>
  );
};

export default Main;
