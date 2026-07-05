import React from "react";
import { FiPackage, FiAlertCircle } from "react-icons/fi";

const formLabels = {
  tablet: "Comprimé",
  capsule: "Gélule",
  syrup: "Sirop",
  injection: "Injection",
  cream: "Crème",
  drops: "Gouttes",
};

const MedicationCard = ({ medication, onAddToCart, onFavorite }) => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <h3 className="card-title text-base">{medication.name}</h3>
          {medication.requiresPrescription && (
            <span className="badge badge-warning gap-1 text-xs"><FiAlertCircle /> Ordonnance requise</span>
          )}
        </div>
        <p className="text-xs text-gray-400 uppercase">{medication.category} · {formLabels[medication.form] || medication.form}</p>
        {medication.pharmacy?.name && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FiPackage /> {medication.pharmacy.name}
          </p>
        )}
        <p className="text-lg font-bold text-primary">{medication.price?.toLocaleString("fr-FR")} FCFA</p>
        <div className="card-actions justify-end mt-2 gap-2">
          {onFavorite && (
            <button onClick={() => onFavorite(medication)} className="btn btn-ghost btn-sm">♥</button>
          )}
          {onAddToCart && (
            <button onClick={() => onAddToCart(medication)} className="btn btn-primary btn-sm">
              Ajouter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
