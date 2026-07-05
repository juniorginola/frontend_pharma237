import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
    <FiAlertTriangle className="text-6xl text-warning" />
    <h1 className="text-3xl font-bold">Page introuvable</h1>
    <p className="text-gray-500 max-w-md">
      La page que vous recherchez n'existe pas ou a été déplacée.
    </p>
    <Link to="/" className="btn btn-primary">
      Retour à l'accueil
    </Link>
  </div>
);

export default NotFound;
