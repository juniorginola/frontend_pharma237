import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiShield, FiClock } from "react-icons/fi";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/medications?search=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <section className="hero bg-gradient-to-br from-primary to-secondary text-primary-content rounded-3xl py-16 px-6">
        <div className="hero-content text-center flex-col max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez votre médicament, près de chez vous
          </h1>
          <p className="mb-6 text-lg opacity-90">
            Pharma237 vous connecte instantanément aux pharmacies proches, vérifie la disponibilité
            des médicaments et digitalise vos ordonnances.
          </p>
          <form onSubmit={handleSearch} className="join w-full max-w-md">
            <input
              type="text"
              placeholder="Rechercher un médicament (ex : Paracétamol)"
              className="input input-bordered join-item w-full text-base-content"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-accent join-item" type="submit">
              <FiSearch /> Rechercher
            </button>
          </form>
          <button onClick={() => navigate("/pharmacies")} className="btn btn-outline btn-sm mt-4 text-primary-content border-primary-content">
            <FiMapPin /> Voir les pharmacies proches
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="card bg-base-100 shadow-md p-6 text-center">
          <FiMapPin className="text-4xl text-primary mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Localisation intelligente</h3>
          <p className="text-sm text-gray-500">
            Identifiez en quelques secondes les pharmacies les plus proches grâce à la recherche géospatiale.
          </p>
        </div>
        <div className="card bg-base-100 shadow-md p-6 text-center">
          <FiClock className="text-4xl text-primary mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Gain de temps</h3>
          <p className="text-sm text-gray-500">
            Vérifiez la disponibilité d'un médicament avant de vous déplacer, et suivez vos commandes en temps réel.
          </p>
        </div>
        <div className="card bg-base-100 shadow-md p-6 text-center">
          <FiShield className="text-4xl text-primary mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-2">Données sécurisées</h3>
          <p className="text-sm text-gray-500">
            Authentification chiffrée, ordonnances protégées : votre santé, en toute confidentialité.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
