import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { FiSave, FiLock } from "react-icons/fi";

const roleLabels = { client: "Client", pharmacy: "Pharmacie", admin: "Administrateur" };

const Profile = () => {
  const { user } = useAuth() || {};
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwdChange = (e) => setPwd({ ...pwd, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const { data } = await api.put("/auth/profile", form);
      const updatedUser = { ...user, ...data.data };
      localStorage.setItem("pharma237_user", JSON.stringify(updatedUser));
      setMessage("Profil mis à jour avec succès.");
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await api.put("/auth/change-password", pwd);
      setMessage("Mot de passe modifié avec succès.");
      setPwd({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Mon profil</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-16">
                <span className="text-xl">{user.firstName?.[0]}{user.lastName?.[0]}</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
              <span className="badge badge-outline">{roleLabels[user.role] || user.role}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label"><span className="label-text">Prénom</span></label>
                <input name="firstName" value={form.firstName} onChange={handleChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Nom</span></label>
                <input name="lastName" value={form.lastName} onChange={handleChange} className="input input-bordered" />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Téléphone</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Adresse</span></label>
              <input name="address" value={form.address} onChange={handleChange} className="input input-bordered" />
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary gap-2 mt-2">
              <FiSave /> Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-base"><FiLock /> Changer de mot de passe</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Mot de passe actuel</span></label>
              <input
                type="password"
                name="currentPassword"
                value={pwd.currentPassword}
                onChange={handlePwdChange}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Nouveau mot de passe</span></label>
              <input
                type="password"
                name="newPassword"
                value={pwd.newPassword}
                onChange={handlePwdChange}
                className="input input-bordered"
                minLength={8}
                required
              />
            </div>
            <button type="submit" disabled={saving} className="btn btn-outline btn-primary">
              Modifier le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
