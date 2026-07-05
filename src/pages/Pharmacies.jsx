import React, { useEffect, useState } from "react";
import api from "../services/api";
import PharmacyCard from "../components/PharmacyCard";
import Loader from "../components/Loader";
import { FiSearch, FiNavigation } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchPharmacies = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/pharmacies", { params });
      setPharmacies(data.data);
    } catch (err) {
      setError("Impossible de charger les pharmacies. Vérifiez que le serveur backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPharmacies(search ? { search } : {});
  };

  const handleNearby = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { data } = await api.get("/pharmacies/nearby", {
            params: { lat: latitude, lng: longitude, maxDistance: 10000 },
          });
          setPharmacies(data.data);
        } catch (err) {
          setError("Erreur lors de la recherche des pharmacies proches.");
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setError("Impossible d'accéder à votre position. Vérifiez les autorisations du navigateur.");
        setGeoLoading(false);
      }
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Pharmacies</h1>
        {user?.role === "pharmacy" && (
          <span className="text-sm text-gray-500">Gérez votre pharmacie depuis votre tableau de bord.</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="join flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom ou ville..."
            className="input input-bordered join-item w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary join-item"><FiSearch /></button>
        </form>
        <button onClick={handleNearby} className={`btn btn-secondary gap-2 ${geoLoading ? "loading" : ""}`}>
          <FiNavigation /> Pharmacies proches de moi
        </button>
      </div>

      {error && <div className="alert alert-warning mb-4 text-sm">{error}</div>}

      {loading ? (
        <Loader />
      ) : pharmacies.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucune pharmacie trouvée.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pharmacies.map((p) => (
            <PharmacyCard key={p._id} pharmacy={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Pharmacies;
