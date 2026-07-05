import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { FiAlertTriangle, FiPlus, FiTrash2 } from "react-icons/fi";

const emptyForm = { pharmacy: "", medication: "", quantity: 0, unitPrice: 0, expiryDate: "", batchNumber: "", lowStockThreshold: 10 };

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [stocksRes, lowRes, expiringRes, pharmaciesRes] = await Promise.all([
        api.get("/stocks"),
        api.get("/stocks/alerts/low"),
        api.get("/stocks/alerts/expiring"),
        api.get("/pharmacies"),
      ]);
      setStocks(stocksRes.data.data);
      setLowStock(lowRes.data.data);
      setExpiring(expiringRes.data.data);
      setPharmacies(pharmaciesRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadMedicationsForPharmacy = async (pharmacyId) => {
    if (!pharmacyId) return setMedications([]);
    const { data } = await api.get("/medications", { params: { pharmacy: pharmacyId, limit: 100 } });
    setMedications(data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/stocks", form);
      setMessage("Entrée de stock ajoutée avec succès.");
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'ajout du stock.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette entrée de stock ?")) return;
    try {
      await api.delete(`/stocks/${id}`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des stocks</h1>
        <button className="btn btn-primary gap-2" onClick={() => setShowForm(!showForm)}>
          <FiPlus /> Nouvelle entrée
        </button>
      </div>

      {message && <div className="alert alert-info text-sm mb-4">{message}</div>}

      {(lowStock.length > 0 || expiring.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {lowStock.length > 0 && (
            <div className="alert alert-warning">
              <FiAlertTriangle />
              <span>{lowStock.length} médicament(s) en stock bas.</span>
            </div>
          )}
          {expiring.length > 0 && (
            <div className="alert alert-error">
              <FiAlertTriangle />
              <span>{expiring.length} médicament(s) proches de la péremption (30 jours).</span>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="card bg-base-100 shadow-md p-6 mb-6">
          <h3 className="font-bold mb-3">Ajouter une entrée de stock</h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3">
            <select
              className="select select-bordered"
              required
              value={form.pharmacy}
              onChange={(e) => { setForm({ ...form, pharmacy: e.target.value, medication: "" }); loadMedicationsForPharmacy(e.target.value); }}
            >
              <option value="">Choisir une pharmacie</option>
              {pharmacies.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select
              className="select select-bordered"
              required
              value={form.medication}
              onChange={(e) => setForm({ ...form, medication: e.target.value })}
            >
              <option value="">Choisir un médicament</option>
              {medications.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
            <input type="number" min="0" placeholder="Quantité" className="input input-bordered" required
              value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value, 10) })} />
            <input type="number" min="0" placeholder="Prix unitaire (FCFA)" className="input input-bordered" required
              value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: parseFloat(e.target.value) })} />
            <input type="date" className="input input-bordered" required
              value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            <input type="text" placeholder="N° de lot" className="input input-bordered"
              value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} />
            <button type="submit" className="btn btn-primary sm:col-span-2">Enregistrer</button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
        <table className="table">
          <thead>
            <tr>
              <th>Médicament</th><th>Pharmacie</th><th>Quantité</th><th>Prix unitaire</th><th>Péremption</th><th>Disponible</th><th></th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s._id}>
                <td>{s.medication?.name}</td>
                <td>{s.pharmacy?.name}</td>
                <td className={s.quantity <= s.lowStockThreshold ? "text-error font-bold" : ""}>{s.quantity}</td>
                <td>{s.unitPrice?.toLocaleString("fr-FR")} FCFA</td>
                <td>{new Date(s.expiryDate).toLocaleDateString("fr-FR")}</td>
                <td>{s.available ? <span className="badge badge-success text-white">Oui</span> : <span className="badge badge-error text-white">Non</span>}</td>
                <td><button onClick={() => handleDelete(s._id)} className="btn btn-ghost btn-xs text-error"><FiTrash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {stocks.length === 0 && <p className="text-center text-gray-400 py-8">Aucun stock enregistré.</p>}
      </div>
    </div>
  );
};

export default Stock;
