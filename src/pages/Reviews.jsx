import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { FiStar, FiThumbsUp, FiThumbsDown, FiFlag, FiTrash2 } from "react-icons/fi";

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews");
      setReviews(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    try {
      if (action === "like") await api.put(`/reviews/${id}/like`);
      if (action === "dislike") await api.put(`/reviews/${id}/dislike`);
      if (action === "report") await api.put(`/reviews/${id}/report`, { reason: "Contenu signalé par un utilisateur" });
      if (action === "delete") { if (!window.confirm("Supprimer cet avis ?")) return; await api.delete(`/reviews/${id}`); }
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Action impossible.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Avis des usagers sur les pharmacies</h1>
      {message && <div className="alert alert-warning text-sm mb-4">{message}</div>}

      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-gray-400">Aucun avis publié pour le moment.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="card bg-base-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{r.user?.firstName} {r.user?.lastName}</span>
                <span className="text-xs text-gray-400 ml-2">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              <span className="text-warning flex items-center gap-1"><FiStar className="fill-current" /> {r.rating}/5</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => act(r._id, "like")} className="btn btn-ghost btn-xs gap-1"><FiThumbsUp /> {r.likes}</button>
              <button onClick={() => act(r._id, "dislike")} className="btn btn-ghost btn-xs gap-1"><FiThumbsDown /> {r.dislikes}</button>
              <button onClick={() => act(r._id, "report")} className="btn btn-ghost btn-xs gap-1 text-warning"><FiFlag /> Signaler</button>
              {(user.role === "admin" || user.id === r.user?._id) && (
                <button onClick={() => act(r._id, "delete")} className="btn btn-ghost btn-xs gap-1 text-error"><FiTrash2 /> Supprimer</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
