import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-10">Commande introuvable.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/orders" className="link link-primary text-sm">← Retour aux commandes</Link>
      <div className="card bg-base-100 shadow-md p-6 mt-4">
        <h1 className="text-xl font-bold mb-2">Commande #{order._id.slice(-6)}</h1>
        <p className="text-sm text-gray-500 mb-1">Pharmacie : {order.pharmacy?.name}</p>
        <p className="text-sm text-gray-500 mb-1">Statut : <span className="badge">{order.orderStatus}</span></p>
        <p className="text-sm text-gray-500 mb-4">Paiement : <span className="badge">{order.paymentStatus}</span> ({order.paymentMethod})</p>

        <table className="table table-sm">
          <thead><tr><th>Médicament</th><th>Quantité</th><th>Prix unitaire</th><th>Sous-total</th></tr></thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.medication?.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice?.toLocaleString("fr-FR")} FCFA</td>
                <td>{(item.quantity * item.unitPrice).toLocaleString("fr-FR")} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-bold text-lg mt-3">
          Total : {order.totalAmount?.toLocaleString("fr-FR")} FCFA
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
