
import React, { useState, useEffect } from 'react';
import { User, Tractor } from '../types';
import { UserService, RequestService, TractorService } from '../services/mockBackend';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

const AdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dealers' | 'inventory' | 'analytics'>('dealers');
  const [dealers, setDealers] = useState<User[]>([]);
  const [tractors, setTractors] = useState<Tractor[]>([]);
  const [refresh, setRefresh] = useState(0);

  // Form State for new Tractor
  const [newTractor, setNewTractor] = useState({
    brand: '',
    model: '',
    variant: '',
    hp: '',
    image: 'https://picsum.photos/400/300'
  });

  // State for Editing Dealer Brands
  const [editingDealerId, setEditingDealerId] = useState<string | null>(null);
  const [editBrandSelection, setEditBrandSelection] = useState<string[]>([]);

  useEffect(() => {
    setDealers(UserService.getAllDealers());
    setTractors(TractorService.getAll());
  }, [refresh]);

  const allRequests = RequestService.getAllRequests();
  const availableBrands = TractorService.getUniqueBrands();

  const handleToggleApproval = (id: string, currentStatus: boolean | undefined) => {
    UserService.updateDealerStatus(id, !currentStatus);
    setRefresh(p => p + 1);
  };

  const handleAddTractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTractor.brand || !newTractor.model) return;

    TractorService.add({
        id: `t_${Date.now()}`,
        brand: newTractor.brand,
        model: newTractor.model,
        variant: newTractor.variant,
        hp: Number(newTractor.hp),
        image: newTractor.image
    });
    setNewTractor({ brand: '', model: '', variant: '', hp: '', image: 'https://picsum.photos/400/300' });
    setRefresh(p => p + 1);
  };

  const handleDeleteTractor = (id: string) => {
    if(confirm('Are you sure you want to remove this tractor from the platform?')) {
        TractorService.delete(id);
        setRefresh(p => p + 1);
    }
  };

  const startEditingDealer = (dealer: User) => {
      setEditingDealerId(dealer.id);
      setEditBrandSelection(dealer.brands || []);
  };

  const saveDealerBrands = (dealerId: string) => {
      UserService.updateDealerBrands(dealerId, editBrandSelection);
      setEditingDealerId(null);
      setRefresh(p => p + 1);
  };

  const toggleEditBrand = (brand: string) => {
      setEditBrandSelection(prev => 
        prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
      );
  };

  // Analytics Data Prep
  const brandData = allRequests.reduce((acc, req) => {
    const brand = req.tractorSnapshot.brand;
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(brandData).map(key => ({
    name: key,
    requests: brandData[key]
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        <div className="flex space-x-2 md:space-x-4">
            <button
                onClick={() => setActiveTab('dealers')}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'dealers' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                {t.dealerApprovals}
            </button>
            <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'inventory' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                {t.tractorInventory}
            </button>
            <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'analytics' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
                {t.platformAnalytics}
            </button>
        </div>
        
        <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all border border-gray-200 bg-white shadow-sm ml-4"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.home}
        </button>
      </div>

      {activeTab === 'dealers' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
             <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">{t.registeredDealers}</h3>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{t.total}: {dealers.length}</span>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.showroom}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.contact}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.assignedBrands}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.control}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {dealers.map(dealer => (
                        <tr key={dealer.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{dealer.showroomName}</div>
                                <div className="text-sm text-gray-500">{dealer.district}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{dealer.name}</div>
                                <div className="text-sm text-gray-500">{dealer.mobile}</div>
                            </td>
                            <td className="px-6 py-4">
                                {editingDealerId === dealer.id ? (
                                    <div className="bg-gray-50 p-2 rounded border border-blue-200 min-w-[200px]">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {availableBrands.map(b => (
                                                <label key={b} className="flex items-center space-x-1 text-xs cursor-pointer bg-white px-2 py-1 rounded border border-gray-200">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={editBrandSelection.includes(b)}
                                                        onChange={() => toggleEditBrand(b)}
                                                    />
                                                    <span>{b}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingDealerId(null)} className="text-xs text-gray-500 underline">{t.cancelEdit}</button>
                                            <button onClick={() => saveDealerBrands(dealer.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">{t.save}</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex gap-1 flex-wrap max-w-xs">
                                            {dealer.brands?.map(b => (
                                                <span key={b} className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {b}
                                                </span>
                                            ))}
                                            {(!dealer.brands || dealer.brands.length === 0) && <span className="text-xs text-gray-400 italic">{t.noneAssigned}</span>}
                                        </div>
                                        <button 
                                            onClick={() => startEditingDealer(dealer)}
                                            className="text-gray-400 hover:text-blue-600"
                                            title="Edit Brands"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dealer.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {dealer.isApproved ? t.active : t.pending}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                    onClick={() => handleToggleApproval(dealer.id, dealer.isApproved)}
                                    className={`px-3 py-1 rounded border ${dealer.isApproved ? 'border-red-600 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                >
                                    {dealer.isApproved ? t.blockDealer : t.approveDealer}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Form */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t.addMasterData}</h3>
                    <p className="text-xs text-gray-500 mb-4">{t.addMasterDataDesc}</p>
                    <form onSubmit={handleAddTractor} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.brandMaster}</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Mahindra"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                value={newTractor.brand}
                                onChange={e => setNewTractor({...newTractor, brand: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.modelName}</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 575 DI"
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                value={newTractor.model}
                                onChange={e => setNewTractor({...newTractor, model: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">{t.variant}</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 4WD"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    value={newTractor.variant}
                                    onChange={e => setNewTractor({...newTractor, variant: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t.hp}</label>
                                <input 
                                    type="number" 
                                    placeholder="45"
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                                    value={newTractor.hp}
                                    onChange={e => setNewTractor({...newTractor, hp: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.imageUrl}</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm"
                                value={newTractor.image}
                                onChange={e => setNewTractor({...newTractor, image: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-black"
                        >
                            {t.addToPlatform}
                        </button>
                    </form>
                </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
                {/* Changed mapping variable 't' to 'tractor' to avoid shadowing the translation object 't' from useLanguage() */}
                {tractors.map(tractor => (
                    <div key={tractor.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={tractor.image} alt={tractor.model} className="w-16 h-16 rounded object-cover bg-gray-100" />
                            <div>
                                <h4 className="font-bold text-gray-900">{tractor.brand} {tractor.model}</h4>
                                <p className="text-sm text-gray-600">{tractor.variant} • {tractor.hp} HP</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDeleteTractor(tractor.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50"
                        >
                            {t.delete}
                        </button>
                    </div>
                ))}
                {tractors.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No tractors in inventory. Add one to start.</div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.requestVolume}</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="requests" fill="#059669" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.platformStats}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-bold">{t.totalUsers}</p>
                        <p className="text-2xl font-bold text-gray-800">{dealers.length + 5} <span className="text-xs font-normal text-gray-500">{t.simulated}</span></p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600 font-bold">{t.totalRequests}</p>
                        <p className="text-2xl font-bold text-gray-800">{allRequests.length}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600 font-bold">{t.inventoryCount}</p>
                        <p className="text-2xl font-bold text-gray-800">{tractors.length}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-600 font-bold">{t.dealerApprovalRate}</p>
                        <p className="text-2xl font-bold text-gray-800">
                             {Math.round((dealers.filter(d => d.isApproved).length / (dealers.length || 1)) * 100)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
