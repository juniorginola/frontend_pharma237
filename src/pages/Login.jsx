import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Connexion</h2>
          {error && <div className="alert alert-error text-sm mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              <FiMail />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FiLock />
              <input
                type="password"
                className="grow"
                placeholder="Mot de passe"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
              Se connecter
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Pas encore de compte ? <Link to="/register" className="link link-primary">S'inscrire</Link>
          </p>
          <div className="divider text-xs">Comptes de démonstration</div>
          <p className="text-xs text-gray-400 text-center">
            admin@pharma237.com · pharmacie.centrale@pharma237.com · client@pharma237.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
