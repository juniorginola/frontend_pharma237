import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const statusColors = { pending: "badge-warning", approved: "badge-success", rejected: "badge-error" };

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ imageUrl: "", doctorName: "" });

  const load = async () => {
    setLoading(true);
    try {
      const endpoint = user.role === "pharmacy" ? "/prescriptions/pending" : user.role === "admin" ? "/prescriptions/all" : "/prescriptions";
      const { data } = await api.get(endpoint);
      setPrescriptions(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/prescriptions", form);
      setMessage("Ordonnance envoyée avec succès. Elle sera examinée par une pharmacie.");
      setForm({ imageUrl: "", doctorName: "" });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'envoi.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/prescriptions/${id}/status`, { status, rejectionReason: status === "rejected" ? "Ordonnance illisible ou non conforme" : undefined });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {user.role === "client" ? "Mes ordonnances" : "Ordonnances à traiter"}
      </h1>

      {message && <div className="alert alert-info text-sm mb-4">{message}</div>}

      {user.role === "client" && (
        <div className="card bg-base-100 shadow-md p-6 mb-6">
          <h3 className="font-bold mb-3">Envoyer une nouvelle ordonnance</h3>
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
            <input
              type="url"
              placeholder="URL de l'image de l'ordonnance"
              className="input input-bordered sm:col-span-2"
              required
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nom du médecin prescripteur (optionnel)"
              className="input input-bordered sm:col-span-2"
              value={form.doctorName}
              onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
            />
            <button type="submit" className="btn btn-primary sm:col-span-2">Envoyer</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {prescriptions.length === 0 && <p className="text-gray-400">Aucune ordonnance à afficher.</p>}
        {prescriptions.map((p) => (
          <div key={p._id} className="card bg-base-100 shadow-sm p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                {p.user && <span className="font-semibold">{p.user.firstName} {p.user.lastName}</span>}
                <span className="text-xs text-gray-400 ml-2">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              <span className={`badge ${statusColors[p.status]} text-white`}>{p.status}</span>
            </div>
            {p.doctorName && <p className="text-sm text-gray-500 mt-1">Médecin : {p.doctorName}</p>}
            <a href={p.imageUrl} target="_blank" rel="noreferrer" className="link link-primary text-sm">Voir l'image de l'ordonnance</a>
            {(user.role === "pharmacy" || user.role === "admin") && p.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => updateStatus(p._id, "approved")} className="btn btn-success btn-xs text-white">Approuver</button>
                <button onClick={() => updateStatus(p._id, "rejected")} className="btn btn-error btn-xs text-white">Rejeter</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prescriptions;
