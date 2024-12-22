// src/components/layouts/AuthLayout.jsx
import PropTypes from "prop-types";

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800A_1px,transparent_1px),linear-gradient(to_bottom,#8080800A_1px,transparent_1px)] bg-[size:14px_14px]" />
      <div className="absolute -left-20 -top-20 w-[400px] h-[400px] bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
