import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import MedicationCard from "../components/MedicationCard";
import { useAuth } from "../context/AuthContext";
import { FiMapPin, FiPhone, FiClock, FiStar, FiCheckCircle } from "react-icons/fi";

const PharmacyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [pharmacy, setPharmacy] = useState(null);
  const [medications, setMedications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [pharmacyRes, medsRes, reviewsRes] = await Promise.all([
        api.get(`/pharmacies/${id}`),
        api.get("/medications", { params: { pharmacy: id } }),
        api.get("/reviews", { params: { pharmacy: id } }),
      ]);
      setPharmacy(pharmacyRes.data.data);
      setMedications(medsRes.data.data);
      setReviews(reviewsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/reviews", { pharmacy: id, ...reviewForm });
      setMessage("Avis publié avec succès !");
      setReviewForm({ rating: 5, comment: "" });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'envoi de l'avis.");
    }
  };

  const addFavorite = async () => {
    try {
      await api.post("/favorites", { pharmacy: id });
      setMessage("Pharmacie ajoutée aux favoris.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur.");
    }
  };

  if (loading) return <Loader />;
  if (!pharmacy) return <p className="text-center py-10">Pharmacie introuvable.</p>;

  return (
    <div>
      <div className="card bg-base-100 shadow-md p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {pharmacy.name}
              {pharmacy.verified && <span className="badge badge-success text-white gap-1"><FiCheckCircle /> Vérifiée</span>}
            </h1>
            <p className="text-gray-500 flex items-center gap-1 mt-1"><FiMapPin /> {pharmacy.address}, {pharmacy.city}</p>
            <p className="text-gray-500 flex items-center gap-1"><FiPhone /> {pharmacy.phone}</p>
            <p className="text-gray-500 flex items-center gap-1"><FiClock /> {pharmacy.openingHours}</p>
            <div className="flex items-center gap-1 text-warning mt-1">
              <FiStar className="fill-current" />
              <span className="font-semibold">{pharmacy.rating?.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({pharmacy.ratingCount} avis)</span>
            </div>
          </div>
          {user?.role === "client" && (
            <button onClick={addFavorite} className="btn btn-outline btn-sm">♥ Ajouter aux favoris</button>
          )}
        </div>
      </div>

      {message && <div className="alert alert-info text-sm mb-4">{message}</div>}

      <h2 className="text-xl font-bold mb-3">Médicaments disponibles</h2>
      {medications.length === 0 ? (
        <p className="text-gray-400 mb-6">Aucun médicament renseigné pour cette pharmacie.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {medications.map((m) => <MedicationCard key={m._id} medication={m} />)}
        </div>
      )}

      <h2 className="text-xl font-bold mb-3">Avis des usagers</h2>
      <div className="space-y-3 mb-6">
        {reviews.length === 0 && <p className="text-gray-400">Aucun avis pour le moment.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="card bg-base-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.user?.firstName} {r.user?.lastName}</span>
              <span className="text-warning flex items-center gap-1"><FiStar className="fill-current" /> {r.rating}/5</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{r.comment}</p>
          </div>
        ))}
      </div>

      {user?.role === "client" && (
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="font-bold mb-3">Laisser un avis</h3>
          <form onSubmit={submitReview} className="space-y-3">
            <select
              className="select select-bordered w-full max-w-xs"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value, 10) })}
            >
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>)}
            </select>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Votre commentaire..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            />
            <button type="submit" className="btn btn-primary">Publier mon avis</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PharmacyDetail;
