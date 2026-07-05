import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Loader from "../components/Loader";
import { FiShoppingCart, FiPackage, FiFileText, FiAlertTriangle, FiUsers, FiMapPin } from "react-icons/fi";

const StatCard = ({ icon, label, value, to }) => (
  <Link to={to} className="stat bg-base-100 shadow-md rounded-xl hover:shadow-lg transition-shadow">
    <div className="stat-figure text-primary text-3xl">{icon}</div>
    <div className="stat-title">{label}</div>
    <div className="stat-value text-primary">{value}</div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        if (user.role === "client") {
          const [orders, prescriptions, favorites] = await Promise.all([
            api.get("/orders/my-orders"),
            api.get("/prescriptions"),
            api.get("/favorites"),
          ]);
          setStats({
            orders: orders.data.count,
            prescriptions: prescriptions.data.total ?? prescriptions.data.count,
            favorites: favorites.data.total ?? favorites.data.count,
          });
        } else if (user.role === "pharmacy") {
          const [lowStock, expiring, orders] = await Promise.all([
            api.get("/stocks/alerts/low"),
            api.get("/stocks/alerts/expiring"),
            api.get("/orders"),
          ]);
          setStats({
            lowStock: lowStock.data.count,
            expiring: expiring.data.count,
            orders: orders.data.total,
          });
        } else if (user.role === "admin") {
          const [users, prescriptions] = await Promise.all([
            api.get("/users"),
            api.get("/prescriptions/stats"),
          ]);
          setStats({ users: users.data.total, prescriptions: prescriptions.data.data.total });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Bonjour, {user.firstName} 👋</h1>
      <p className="text-gray-500 mb-6">
        {user.role === "client" && "Voici un aperçu de votre activité sur Pharma237."}
        {user.role === "pharmacy" && "Voici un aperçu de la gestion de votre pharmacie."}
        {user.role === "admin" && "Voici un aperçu global de la plateforme."}
      </p>

      {user.role === "client" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={<FiShoppingCart />} label="Mes commandes" value={stats.orders ?? 0} to="/orders" />
          <StatCard icon={<FiFileText />} label="Mes ordonnances" value={stats.prescriptions ?? 0} to="/prescriptions" />
          <StatCard icon={<FiPackage />} label="Mes favoris" value={stats.favorites ?? 0} to="/favorites" />
        </div>
      )}

      {user.role === "pharmacy" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={<FiAlertTriangle />} label="Stocks bas" value={stats.lowStock ?? 0} to="/stock" />
          <StatCard icon={<FiAlertTriangle />} label="Péremption proche" value={stats.expiring ?? 0} to="/stock" />
          <StatCard icon={<FiShoppingCart />} label="Commandes reçues" value={stats.orders ?? 0} to="/orders" />
        </div>
      )}

      {user.role === "admin" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={<FiUsers />} label="Utilisateurs" value={stats.users ?? 0} to="/admin/users" />
          <StatCard icon={<FiFileText />} label="Ordonnances" value={stats.prescriptions ?? 0} to="/prescriptions" />
          <StatCard icon={<FiMapPin />} label="Pharmacies" value="—" to="/pharmacies" />
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="font-bold mb-2">Actions rapides</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/pharmacies" className="btn btn-sm btn-outline">Trouver une pharmacie</Link>
            <Link to="/medications" className="btn btn-sm btn-outline">Rechercher un médicament</Link>
            {user.role === "client" && <Link to="/prescriptions" className="btn btn-sm btn-outline">Envoyer une ordonnance</Link>}
            {user.role === "pharmacy" && <Link to="/stock" className="btn btn-sm btn-outline">Gérer mon stock</Link>}
          </div>
        </div>
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="font-bold mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-gray-500">
            Consultez le fichier README du projet pour la documentation complète de l'API et les identifiants de démonstration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
