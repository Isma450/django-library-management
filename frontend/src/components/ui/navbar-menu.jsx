import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4"
        >
          <div className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl">
            <div className="w-max h-full p-4">{children}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

MenuItem.propTypes = {
  setActive: PropTypes.func.isRequired,
  active: PropTypes.string,
  item: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const Menu = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent bg-white/30 dark:bg-black/50 backdrop-blur-md shadow-input flex justify-center space-x-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

Menu.propTypes = {
  setActive: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black"
    >
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

NavLink.defaultProps = {
  className: "",
};
