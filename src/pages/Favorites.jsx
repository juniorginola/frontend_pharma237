import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import PharmacyCard from "../components/PharmacyCard";
import MedicationCard from "../components/MedicationCard";

const Favorites = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, mRes] = await Promise.all([
        api.get("/favorites/pharmacies"),
        api.get("/favorites/medications"),
      ]);
      setPharmacies(pRes.data.data);
      setMedications(mRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes favoris</h1>

      <h2 className="text-lg font-bold mb-3">Pharmacies favorites</h2>
      {pharmacies.length === 0 ? (
        <p className="text-gray-400 mb-8">Aucune pharmacie en favori.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {pharmacies.map((p) => <PharmacyCard key={p._id} pharmacy={p} />)}
        </div>
      )}

      <h2 className="text-lg font-bold mb-3">Médicaments favoris</h2>
      {medications.length === 0 ? (
        <p className="text-gray-400">Aucun médicament en favori.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((m) => <MedicationCard key={m._id} medication={m} />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
