import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { FiPlus, FiTrash2, FiEdit2, FiSave } from "react-icons/fi";

const emptyPharmacyForm = {
  name: "", licenseNumber: "", phone: "", email: "", address: "", city: "",
  lat: "", lng: "", openingHours: "08h00 - 20h00",
};
const emptyMedForm = { name: "", genericName: "", category: "autre", form: "tablet", price: "", requiresPrescription: false, description: "" };
const CATEGORIES = ["antibiotique", "antalgique", "antipaludique", "antiinflammatoire", "vitamine", "antihypertenseur", "antidiabetique", "dermatologie", "autre"];
const FORMS = { tablet: "Comprimé", capsule: "Gélule", syrup: "Sirop", injection: "Injection", cream: "Crème", drops: "Gouttes" };

const MyPharmacy = () => {
  const { user } = useAuth();
  const [pharmacy, setPharmacy] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pharmacyForm, setPharmacyForm] = useState(emptyPharmacyForm);
  const [medForm, setMedForm] = useState(emptyMedForm);
  const [editingMedId, setEditingMedId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      // Une pharmacie n'ayant pas d'endpoint "par propriétaire", on récupère
      // la liste et on filtre côté client sur l'utilisateur connecté.
      const { data } = await api.get("/pharmacies", { params: { limit: 100 } });
      const mine = data.data.find((p) => (p.owner?._id || p.owner) === user.id);
      setPharmacy(mine || null);
      if (mine) {
        const medsRes = await api.get("/medications", { params: { pharmacy: mine._id, limit: 100 } });
        setMedications(medsRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreatePharmacy = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const payload = {
        name: pharmacyForm.name,
        licenseNumber: pharmacyForm.licenseNumber,
        phone: pharmacyForm.phone,
        email: pharmacyForm.email,
        address: pharmacyForm.address,
        city: pharmacyForm.city,
        openingHours: pharmacyForm.openingHours,
        location: { type: "Point", coordinates: [parseFloat(pharmacyForm.lng), parseFloat(pharmacyForm.lat)] },
      };
      const { data } = await api.post("/pharmacies", payload);
      setPharmacy(data.data);
      setMessage("Pharmacie enregistrée avec succès !");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de la pharmacie.");
    }
  };

  const handleMedSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const payload = { ...medForm, price: parseFloat(medForm.price), pharmacy: pharmacy._id };
      if (editingMedId) {
        await api.put(`/medications/${editingMedId}`, payload);
        setMessage("Médicament mis à jour.");
      } else {
        await api.post("/medications", payload);
        setMessage("Médicament ajouté au catalogue.");
      }
      setMedForm(emptyMedForm);
      setEditingMedId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement du médicament.");
    }
  };

  const handleEditMed = (m) => {
    setEditingMedId(m._id);
    setMedForm({
      name: m.name, genericName: m.genericName || "", category: m.category, form: m.form,
      price: m.price, requiresPrescription: m.requiresPrescription, description: m.description || "",
    });
  };

  const handleDeleteMed = async (id) => {
    if (!window.confirm("Supprimer ce médicament du catalogue ?")) return;
    try {
      await api.delete(`/medications/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <Loader />;

  if (!pharmacy) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Enregistrer ma pharmacie</h1>
        <p className="text-gray-500 mb-6">
          Vous n'avez pas encore de pharmacie enregistrée sur Pharma237. Renseignez les informations
          ci-dessous pour commencer à gérer votre catalogue et vos stocks.
        </p>
        {error && <div className="alert alert-error mb-4 text-sm">{error}</div>}
        <form onSubmit={handleCreatePharmacy} className="card bg-base-100 shadow-md p-6 space-y-3">
          <input required placeholder="Nom de la pharmacie" className="input input-bordered w-full" value={pharmacyForm.name} onChange={(e) => setPharmacyForm({ ...pharmacyForm, name: e.target.value })} />
          <input required placeholder="Numéro d'agrément" className="input input-bordered w-full" value={pharmacyForm.licenseNumber} onChange={(e) => setPharmacyForm({ ...pharmacyForm, licenseNumber: e.target.value })} />
          <input required placeholder="Téléphone" className="input input-bordered w-full" value={pharmacyForm.phone} onChange={(e) => setPharmacyForm({ ...pharmacyForm, phone: e.target.value })} />
          <input type="email" placeholder="Email (optionnel)" className="input input-bordered w-full" value={pharmacyForm.email} onChange={(e) => setPharmacyForm({ ...pharmacyForm, email: e.target.value })} />
          <input required placeholder="Adresse" className="input input-bordered w-full" value={pharmacyForm.address} onChange={(e) => setPharmacyForm({ ...pharmacyForm, address: e.target.value })} />
          <input required placeholder="Ville" className="input input-bordered w-full" value={pharmacyForm.city} onChange={(e) => setPharmacyForm({ ...pharmacyForm, city: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" step="any" placeholder="Latitude (ex : 3.848)" className="input input-bordered w-full" value={pharmacyForm.lat} onChange={(e) => setPharmacyForm({ ...pharmacyForm, lat: e.target.value })} />
            <input required type="number" step="any" placeholder="Longitude (ex : 11.5021)" className="input input-bordered w-full" value={pharmacyForm.lng} onChange={(e) => setPharmacyForm({ ...pharmacyForm, lng: e.target.value })} />
          </div>
          <input placeholder="Horaires d'ouverture" className="input input-bordered w-full" value={pharmacyForm.openingHours} onChange={(e) => setPharmacyForm({ ...pharmacyForm, openingHours: e.target.value })} />
          <button type="submit" className="btn btn-primary w-full">Créer ma pharmacie</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{pharmacy.name}</h1>
        <p className="text-gray-500">{pharmacy.address}, {pharmacy.city} · {pharmacy.phone}</p>
        {!pharmacy.verified && (
          <div className="alert alert-warning mt-3 text-sm">
            Votre pharmacie est en attente de vérification par un administrateur.
          </div>
        )}
      </div>

      {message && <div className="alert alert-success text-sm">{message}</div>}
      {error && <div className="alert alert-error text-sm">{error}</div>}

      <div className="card bg-base-100 shadow-md p-6">
        <h2 className="font-bold mb-3">{editingMedId ? "Modifier le médicament" : "Ajouter un médicament au catalogue"}</h2>
        <form onSubmit={handleMedSubmit} className="grid sm:grid-cols-2 gap-3">
          <input required placeholder="Nom commercial" className="input input-bordered" value={medForm.name} onChange={(e) => setMedForm({ ...medForm, name: e.target.value })} />
          <input placeholder="Nom générique" className="input input-bordered" value={medForm.genericName} onChange={(e) => setMedForm({ ...medForm, genericName: e.target.value })} />
          <select className="select select-bordered" value={medForm.category} onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="select select-bordered" value={medForm.form} onChange={(e) => setMedForm({ ...medForm, form: e.target.value })}>
            {Object.entries(FORMS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input required type="number" min="0" placeholder="Prix (FCFA)" className="input input-bordered" value={medForm.price} onChange={(e) => setMedForm({ ...medForm, price: e.target.value })} />
          <label className="label cursor-pointer justify-start gap-3 input input-bordered">
            <span className="label-text">Ordonnance requise</span>
            <input type="checkbox" className="checkbox checkbox-primary" checked={medForm.requiresPrescription} onChange={(e) => setMedForm({ ...medForm, requiresPrescription: e.target.checked })} />
          </label>
          <textarea placeholder="Description (optionnel)" className="textarea textarea-bordered sm:col-span-2" value={medForm.description} onChange={(e) => setMedForm({ ...medForm, description: e.target.value })} />
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="btn btn-primary gap-2">
              {editingMedId ? <><FiSave /> Enregistrer</> : <><FiPlus /> Ajouter</>}
            </button>
            {editingMedId && (
              <button type="button" className="btn btn-ghost" onClick={() => { setEditingMedId(null); setMedForm(emptyMedForm); }}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-bold mb-3">Catalogue de médicaments ({medications.length})</h2>
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
          <table className="table">
            <thead><tr><th>Nom</th><th>Catégorie</th><th>Forme</th><th>Prix</th><th>Ordonnance</th><th></th></tr></thead>
            <tbody>
              {medications.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.category}</td>
                  <td>{FORMS[m.form] || m.form}</td>
                  <td>{m.price?.toLocaleString("fr-FR")} FCFA</td>
                  <td>{m.requiresPrescription ? "Oui" : "Non"}</td>
                  <td className="flex gap-1">
                    <button onClick={() => handleEditMed(m)} className="btn btn-ghost btn-xs"><FiEdit2 /></button>
                    <button onClick={() => handleDeleteMed(m._id)} className="btn btn-ghost btn-xs text-error"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {medications.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400 py-6">Aucun médicament dans le catalogue pour l'instant.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPharmacy;
