import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <div className="alert alert-error">
          <span>Accès refusé : cette page n'est pas accessible à votre rôle ({user.role}).</span>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
