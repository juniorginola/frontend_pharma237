import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Pharmacies from "./pages/Pharmacies";
import PharmacyDetail from "./pages/PharmacyDetail";
import Medications from "./pages/Medications";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Reviews from "./pages/Reviews";
import Favorites from "./pages/Favorites";
import Prescriptions from "./pages/Prescriptions";
import MyPharmacy from "./pages/MyPharmacy";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/pharmacies" element={<Pharmacies />} />
          <Route path="/pharmacies/:id" element={<PharmacyDetail />} />
          <Route path="/medications" element={<Medications />} />

          <Route path="/stock" element={<ProtectedRoute roles={["pharmacy", "admin"]}><Stock /></ProtectedRoute>} />
          <Route path="/my-pharmacy" element={<ProtectedRoute roles={["pharmacy"]}><MyPharmacy /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute roles={["client"]}><Favorites /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer footer-center p-6 bg-base-100 text-base-content border-t mt-10">
        <p>© {new Date().getFullYear()} Pharma237 — Plateforme numérique de gestion pharmaceutique. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
