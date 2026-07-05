import React from "react";

const Loader = ({ label = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <span className="loading loading-spinner loading-lg text-primary"></span>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default Loader;
