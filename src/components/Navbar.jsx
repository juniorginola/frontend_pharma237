import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiMapPin,
  FiPackage,
  FiShoppingCart,
  FiStar,
  FiHeart,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <span className="text-2xl">💊</span> Pharma237
        </Link>
      </div>

      {user && (
        <div className="hidden lg:flex flex-none gap-1">
          <Link to="/dashboard" className="btn btn-ghost btn-sm gap-2"><FiHome /> Tableau de bord</Link>
          <Link to="/pharmacies" className="btn btn-ghost btn-sm gap-2"><FiMapPin /> Pharmacies</Link>
          <Link to="/medications" className="btn btn-ghost btn-sm gap-2"><FiPackage /> Médicaments</Link>
          {user.role === "client" && (
            <>
              <Link to="/orders" className="btn btn-ghost btn-sm gap-2"><FiShoppingCart /> Commandes</Link>
              <Link to="/prescriptions" className="btn btn-ghost btn-sm gap-2"><FiFileText /> Ordonnances</Link>
              <Link to="/favorites" className="btn btn-ghost btn-sm gap-2"><FiHeart /> Favoris</Link>
            </>
          )}
          {user.role === "pharmacy" && (
            <>
              <Link to="/my-pharmacy" className="btn btn-ghost btn-sm gap-2"><FiMapPin /> Ma pharmacie</Link>
              <Link to="/stock" className="btn btn-ghost btn-sm gap-2"><FiPackage /> Stocks</Link>
              <Link to="/orders" className="btn btn-ghost btn-sm gap-2"><FiShoppingCart /> Commandes</Link>
              <Link to="/prescriptions" className="btn btn-ghost btn-sm gap-2"><FiFileText /> Ordonnances</Link>
            </>
          )}
          {user.role === "admin" && (
            <Link to="/admin/users" className="btn btn-ghost btn-sm gap-2"><FiUsers /> Utilisateurs</Link>
          )}
          <Link to="/reviews" className="btn btn-ghost btn-sm gap-2"><FiStar /> Avis</Link>
        </div>
      )}

      <div className="flex-none gap-2 ml-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">{user.firstName} {user.lastName}</li>
              <li><Link to="/profile"><FiUser /> Mon profil</Link></li>
              <li className="lg:hidden"><Link to="/dashboard">Tableau de bord</Link></li>
              <li className="lg:hidden"><Link to="/pharmacies">Pharmacies</Link></li>
              <li className="lg:hidden"><Link to="/medications">Médicaments</Link></li>
              <li><button onClick={handleLogout} className="text-error"><FiLogOut /> Déconnexion</button></li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Connexion</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Inscription</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
