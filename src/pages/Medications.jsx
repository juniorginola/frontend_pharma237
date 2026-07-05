import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import MedicationCard from "../components/MedicationCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { FiSearch } from "react-icons/fi";

const CATEGORIES = [
  "", "antibiotique", "antalgique", "antipaludique", "antiinflammatoire",
  "vitamine", "antihypertenseur", "antidiabetique", "dermatologie", "autre",
];

const Medications = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("");
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/medications/search", { params: { q: query, category } });
      setMedications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  const handleOrder = async (medication) => {
    if (!user) return navigate("/login");
    if (user.role !== "client") {
      setMessage("Seul un compte usager (client) peut passer commande.");
      return;
    }
    try {
      await api.post("/orders", {
        pharmacy: medication.pharmacy._id || medication.pharmacy,
        items: [{ medication: medication._id, quantity: 1, unitPrice: medication.price }],
        paymentMethod: "cash",
      });
      setMessage(`Commande créée pour "${medication.name}". Consultez la page Commandes pour la suivre.`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la création de la commande.");
    }
  };

  const handleFavorite = async (medication) => {
    if (!user) return navigate("/login");
    try {
      await api.post("/favorites", { medication: medication._id });
      setMessage(`"${medication.name}" ajouté à vos favoris.`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'ajout aux favoris.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rechercher un médicament</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Nom du médicament..."
          className="input input-bordered flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="select select-bordered" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || "Toutes les catégories"}</option>)}
        </select>
        <button type="submit" className="btn btn-primary gap-2"><FiSearch /> Rechercher</button>
      </form>

      {message && <div className="alert alert-info text-sm mb-4">{message}</div>}

      {loading ? (
        <Loader />
      ) : medications.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucun médicament trouvé pour cette recherche.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((m) => (
            <MedicationCard key={m._id} medication={m} onAddToCart={handleOrder} onFavorite={handleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Medications;
