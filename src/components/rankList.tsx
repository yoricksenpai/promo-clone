import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Star, Wallet, Gift, Trophy, Edit, Trash2 } from 'lucide-react';

interface RankItem {
  _id: string;
  siteName: string;
  logo: string;
  advantages: string[];
  welcomeBonus: string;
  payments: string[];
  promoCode: string;
  rank: number;
}

const RankItemsList: React.FC = () => {
  const [items, setItems] = useState<RankItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('api/rankitems');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`api/rankitems/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Betting Sites</h1>
          <button
            onClick={() => navigate('/add')}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Add New Site
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item._id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={item.logo} alt={item.siteName} className="w-12 h-12 object-contain rounded-lg" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.siteName}</h3>
                      <span className="text-yellow-400 flex items-center gap-1">
                        <Trophy className="w-4 h-4" /> Rank #{item.rank}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit/${item._id}`)}
                      className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <span>{item.welcomeBonus}</span>
                  </div>

                  <div>
                    <h4 className="text-gray-400 mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Advantages
                    </h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {item.advantages.map((advantage, index) => (
                        <li key={index}>{advantage}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-gray-400 mb-2 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-yellow-400" />
                      Payment Methods
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.payments.map((payment, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm"
                        >
                          {payment}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <span className="text-yellow-400 font-medium">
                      Promo Code: {item.promoCode}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankItemsList;