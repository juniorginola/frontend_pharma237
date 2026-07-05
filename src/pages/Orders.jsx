import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const statusColors = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-error",
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const endpoint = user.role === "client" ? "/orders/my-orders" : "/orders";
      const { data } = await api.get(endpoint);
      setOrders(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, orderStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { orderStatus });
      setMessage("Statut de la commande mis à jour.");
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Annuler cette commande ?")) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {user.role === "client" ? "Mes commandes" : "Commandes reçues"}
      </h1>

      {message && <div className="alert alert-info text-sm mb-4">{message}</div>}

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Aucune commande pour le moment.</p>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
          <table className="table">
            <thead>
              <tr>
                <th>Référence</th>
                {user.role !== "client" && <th>Client</th>}
                <th>Pharmacie</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Paiement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td><Link to={`/orders/${o._id}`} className="link link-primary">#{o._id.slice(-6)}</Link></td>
                  {user.role !== "client" && <td>{o.user?.firstName} {o.user?.lastName}</td>}
                  <td>{o.pharmacy?.name}</td>
                  <td>{o.totalAmount?.toLocaleString("fr-FR")} FCFA</td>
                  <td><span className={`badge ${statusColors[o.orderStatus]} text-white`}>{o.orderStatus}</span></td>
                  <td>{o.paymentStatus}</td>
                  <td className="flex gap-1 flex-wrap">
                    {user.role === "client" && o.orderStatus === "pending" && (
                      <button onClick={() => cancelOrder(o._id)} className="btn btn-xs btn-error text-white">Annuler</button>
                    )}
                    {(user.role === "pharmacy" || user.role === "admin") && (
                      <select
                        className="select select-xs select-bordered"
                        value={o.orderStatus}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        {["pending", "confirmed", "processing", "delivered", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
