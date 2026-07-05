import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { FiUserPlus, FiSearch } from "react-icons/fi";

const roleLabels = { client: "Client", pharmacy: "Pharmacie", admin: "Administrateur" };

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", password: "", role: "client" };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", { params: { page, search, role: roleFilter || undefined } });
      setUsers(data.data);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.post("/users", form);
      setMessage("Utilisateur créé avec succès.");
      setForm(emptyForm);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de l'utilisateur.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <button className="btn btn-primary gap-2" onClick={() => setShowForm(!showForm)}>
          <FiUserPlus /> Nouvel utilisateur
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="card bg-base-100 shadow-md p-4 grid md:grid-cols-3 gap-3">
          <input required placeholder="Prénom" className="input input-bordered" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <input required placeholder="Nom" className="input input-bordered" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <input required type="email" placeholder="Email" className="input input-bordered" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required placeholder="Téléphone (+237...)" className="input input-bordered" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input required type="password" minLength={8} placeholder="Mot de passe" className="input input-bordered" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="select select-bordered" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="client">Client</option>
            <option value="pharmacy">Pharmacie</option>
            <option value="admin">Administrateur</option>
          </select>
          <button type="submit" className="btn btn-primary md:col-span-3">Créer l'utilisateur</button>
        </form>
      )}

      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3">
        <div className="join">
          <input
            className="input input-bordered join-item"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn join-item" type="submit"><FiSearch /></button>
        </div>
        <select className="select select-bordered" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les rôles</option>
          <option value="client">Client</option>
          <option value="pharmacy">Pharmacie</option>
          <option value="admin">Administrateur</option>
        </select>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow-md">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td><span className="badge badge-outline">{roleLabels[u.role] || u.role}</span></td>
                  <td>
                    <span className={`badge ${u.status === "active" ? "badge-success" : "badge-error"}`}>
                      {u.status === "active" ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400 py-6">Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="join flex justify-center">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`join-item btn btn-sm ${p === page ? "btn-active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
