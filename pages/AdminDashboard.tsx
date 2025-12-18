
import React, { useState, useEffect } from 'react';
import { User, Tractor } from '../types';
import { UserService, RequestService, TractorService } from '../services/mockBackend';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_LOGOS } from '../constants';

interface Props {
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

const AdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dealers' | 'inventory' | 'analytics'>('dealers');
  const [dealers, setDealers] = useState<User[]>([]);
  const [tractors, setTractors] = useState<Tractor[]>([]);
  const [refresh, setRefresh] = useState(0);

  const [newTractor, setNewTractor] = useState({ brand: '', model: '', variant: '', hp: '', image: 'https://picsum.photos/400/300', youtubeId: '' });
  const [editingDealerId, setEditingDealerId] = useState<string | null>(null);
  const [editBrandSelection, setEditBrandSelection] = useState<string[]>([]);

  useEffect(() => {
    setDealers(UserService.getAllDealers());
    setTractors(TractorService.getAll());
  }, [refresh]);

  const allRequests = RequestService.getAllRequests();
  const availableBrands = TractorService.getUniqueBrands();

  const handleAddTractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTractor.brand || !newTractor.model) return;
    TractorService.add({ id: `t_${Date.now()}`, brand: newTractor.brand, model: newTractor.model, variant: newTractor.variant, hp: Number(newTractor.hp), image: newTractor.image, youtubeId: newTractor.youtubeId });
    setNewTractor({ brand: '', model: '', variant: '', hp: '', image: 'https://picsum.photos/400/300', youtubeId: '' });
    setRefresh(p => p + 1);
  };

  const groupedTractors = tractors.reduce((acc, tractor) => {
    if (!acc[tractor.brand]) acc[tractor.brand] = [];
    acc[tractor.brand].push(tractor);
    return acc;
  }, {} as Record<string, Tractor[]>);

  const chartData = Object.keys(allRequests.reduce((acc, req) => {
    const b = req.tractorSnapshot.brand;
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(name => ({ name, requests: 1 })); // simplified mock analytics

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b pb-2 overflow-x-auto">
        <div className="flex space-x-2">
            <button onClick={() => setActiveTab('dealers')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'dealers' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>{t.dealerApprovals}</button>
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'inventory' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>{t.tractorInventory}</button>
            <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>{t.platformAnalytics}</button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow border">
                <h3 className="text-lg font-bold mb-4">{t.addMasterData}</h3>
                <form onSubmit={handleAddTractor} className="space-y-4">
                    <input type="text" placeholder="Brand" className="block w-full border rounded p-2" value={newTractor.brand} onChange={e => setNewTractor({...newTractor, brand: e.target.value})} required />
                    <input type="text" placeholder="Model" className="block w-full border rounded p-2" value={newTractor.model} onChange={e => setNewTractor({...newTractor, model: e.target.value})} required />
                    <input type="number" placeholder="HP" className="block w-full border rounded p-2" value={newTractor.hp} onChange={e => setNewTractor({...newTractor, hp: e.target.value})} />
                    <input type="text" placeholder="YouTube ID" className="block w-full border rounded p-2" value={newTractor.youtubeId} onChange={e => setNewTractor({...newTractor, youtubeId: e.target.value})} />
                    <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded font-bold">{t.addToPlatform}</button>
                </form>
            </div>
            <div className="lg:col-span-2 space-y-6">
                {Object.keys(groupedTractors).sort().map(brand => (
                    <div key={brand} className="bg-white rounded-xl shadow border overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b font-bold flex items-center gap-2">
                            {BRAND_LOGOS[brand] && <img src={BRAND_LOGOS[brand]} className="h-5" />}
                            {brand}
                        </div>
                        <div className="divide-y">
                            {groupedTractors[brand].map(t => (
                                <div key={t.id} className="p-3 flex justify-between items-center">
                                    <span>{t.model} ({t.hp} HP)</span>
                                    <button onClick={() => { TractorService.delete(t.id); setRefresh(p => p+1); }} className="text-red-600 text-sm">Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
      
      {activeTab === 'dealers' && (
        <div className="bg-white rounded-xl shadow border p-4">
            <h3 className="font-bold mb-4">{t.registeredDealers}</h3>
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr><th className="px-4 py-2 text-left">Showroom</th><th className="px-4 py-2 text-left">Brands</th><th className="px-4 py-2 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                    {dealers.map(d => (
                        <tr key={d.id}>
                            <td className="px-4 py-2">{d.showroomName} ({d.name})</td>
                            <td className="px-4 py-2">{d.brands?.join(', ')}</td>
                            <td className="px-4 py-2 text-right">
                                <button onClick={() => { UserService.updateDealerStatus(d.id, !d.isApproved); setRefresh(p => p+1); }} className={`px-3 py-1 rounded text-white ${d.isApproved ? 'bg-red-600' : 'bg-green-600'}`}>
                                    {d.isApproved ? 'Block' : 'Approve'}
                                </button>
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

export default AdminDashboard;
