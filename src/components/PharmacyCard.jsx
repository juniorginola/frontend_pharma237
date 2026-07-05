import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiStar, FiCheckCircle, FiPhone } from "react-icons/fi";

const PharmacyCard = ({ pharmacy }) => {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <h3 className="card-title text-lg">{pharmacy.name}</h3>
          {pharmacy.verified && (
            <span className="badge badge-success gap-1 text-white"><FiCheckCircle /> Vérifiée</span>
          )}
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FiMapPin /> {pharmacy.address}, {pharmacy.city}
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FiPhone /> {pharmacy.phone}
        </p>
        <div className="flex items-center gap-1 text-warning">
          <FiStar className="fill-current" />
          <span className="font-semibold">{pharmacy.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-xs text-gray-400">({pharmacy.ratingCount || 0} avis)</span>
        </div>
        {pharmacy.distance !== undefined && (
          <span className="badge badge-outline">{(pharmacy.distance / 1000).toFixed(1)} km</span>
        )}
        <div className="card-actions justify-end mt-2">
          <Link to={`/pharmacies/${pharmacy._id}`} className="btn btn-primary btn-sm">
            Voir la pharmacie
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PharmacyCard;
