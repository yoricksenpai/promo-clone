import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react"
import HomePage from './pages/HomePage';
import AddRankItem from './pages/addRankItem';
import EditRankItem from './pages/EditRankItem';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <SpeedInsights /> {/* Add this line to use SpeedInsights */}
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
    </>
  );
};

const Footer = () => (
  <footer className="text-center text-sm mt-12 py-4 border-t border-white border-opacity-20">
    <p>&copy; 2024 Votre Site de Paris. Tous droits réservés.</p>
  </footer>
);

export default App;