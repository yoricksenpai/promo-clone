import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddRankItem from './pages/addRankItem';
import EditRankItem from './pages/EditRankItem';

/**
 * The main app component, which renders the layout for the entire application.
 *
 * The app renders a navigation bar with links to the home page and the add rank item page.
 * It also renders a set of routes, which determine which page to render based on the current URL.
 * The routes are:
 * - `/`: renders the home page
 * - `/add-rank-item`: renders the add rank item page
 * - `/edit/:id`: renders the edit rank item page with the given ID
 *
 * The app also renders a footer component at the bottom of the page.
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <nav>
          <ul className="flex space-x-4 mb-4">
            <li><Link to="/" className="text-yellow-300 hover:text-yellow-100">Accueil</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-rank-item" element={<AddRankItem />} />
          <Route path="/edit/:id" element={<EditRankItem />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="text-center text-sm mt-12 py-4 border-t border-white border-opacity-20">
    <p>&copy; 2024 Votre Site de Paris. Tous droits réservés.</p>
  </footer>
);

export default App;