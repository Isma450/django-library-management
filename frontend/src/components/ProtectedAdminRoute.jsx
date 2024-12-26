// src/components/auth/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

export const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user || user.email !== "admin@ismail.com") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

ProtectedAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
