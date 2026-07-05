import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.map((x) => x.msg).join(" · ") : err.response?.data?.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Créer un compte</h2>
          {error && <div className="alert alert-error text-sm mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="firstName" placeholder="Prénom" className="input input-bordered w-full" required value={form.firstName} onChange={handleChange} />
              <input name="lastName" placeholder="Nom" className="input input-bordered w-full" required value={form.lastName} onChange={handleChange} />
            </div>
            <input type="email" name="email" placeholder="Email" className="input input-bordered w-full" required value={form.email} onChange={handleChange} />
            <input name="phone" placeholder="Téléphone (+237612345678)" className="input input-bordered w-full" required value={form.phone} onChange={handleChange} />
            <input type="password" name="password" placeholder="Mot de passe (8 caractères min., 1 chiffre)" className="input input-bordered w-full" required value={form.password} onChange={handleChange} />
            <select name="role" className="select select-bordered w-full" value={form.role} onChange={handleChange}>
              <option value="client">Je suis un usager (client)</option>
              <option value="pharmacy">Je représente une pharmacie</option>
            </select>
            <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
              S'inscrire
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Déjà inscrit ? <Link to="/login" className="link link-primary">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
