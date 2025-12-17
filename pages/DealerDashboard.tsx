import React, { useState, useEffect } from 'react';
import { User, QuotationRequest } from '../types';
import { RequestService } from '../services/mockBackend';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

const DealerDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [quotingRequestId, setQuotingRequestId] = useState<string | null>(null);

  useEffect(() => {
    setRequests(RequestService.getRequestsForDealer(user));
  }, [user, refresh]);

  if (!user.isApproved) {
    return (
        <div className="p-10 text-center bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
            <h2 className="text-2xl font-bold mb-2">{t.accountPending}</h2>
            <p>{t.accountPendingMsg}</p>
        </div>
    );
  }

  return (
    <div>
      {/* Home Button and Dealer Name Display */}
      <div className="flex justify-between items-start mb-6">
        <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all border border-gray-200 bg-white shadow-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.home}
        </button>

        <div className="text-right bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white min-w-[200px]">
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            {user.showroomName && (
                <p className="text-sm font-medium text-green-700">{user.showroomName}</p>
            )}
             <div className="flex justify-end gap-2 mt-1">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{user.district}</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">{t.totalRequests}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{requests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase">{t.myQuotesSent}</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
                {requests.filter(r => r.quotes.some(q => q.dealerId === user.id)).length}
            </p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">{t.marketplaceRequests}</h2>
      
      <div className="space-y-4">
        {requests.length === 0 ? (
             <p className="text-gray-500 italic">{t.noActiveRequests}</p>
        ) : (
            requests.map(req => {
                const myQuote = req.quotes.find(q => q.dealerId === user.id);
                const isQuoting = quotingRequestId === req.id;

                return (
                    <div key={req.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition hover:shadow-md">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                            <div className="flex items-start gap-4">
                                <img src={req.tractorSnapshot.image} className="w-20 h-20 rounded bg-gray-200 object-cover" alt="tractor" />
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 mb-1">
                                        {t.requestedOn}: {new Date(req.createdAt).toLocaleDateString()}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900">{req.tractorSnapshot.brand} {req.tractorSnapshot.model}</h3>
                                    <p className="text-sm text-gray-600">{req.tractorSnapshot.variant} • {req.district}</p>
                                    <p className="text-sm text-blue-600 mt-1">Customer: {req.customerName}</p>
                                </div>
                            </div>
                            
                            <div className="md:text-right">
                                {myQuote ? (
                                    <div className="text-sm">
                                        <p className="text-green-700 font-semibold flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            {t.quoteSubmitted}
                                        </p>
                                        <p className="font-bold text-gray-900 mt-1">₹{myQuote.finalPrice.toLocaleString()}</p>
                                        <button 
                                            onClick={() => setQuotingRequestId(req.id)}
                                            className="text-xs text-gray-500 underline mt-2 hover:text-gray-700"
                                        >
                                            {t.editQuote}
                                        </button>
                                    </div>
                                ) : (
                                    !isQuoting && (
                                        <button
                                            onClick={() => setQuotingRequestId(req.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded shadow-sm transition-colors"
                                        >
                                            {t.submitQuote}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {isQuoting && (
                            <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
                                <QuoteForm 
                                    request={req}
                                    dealer={user}
                                    existingQuote={myQuote}
                                    onCancel={() => setQuotingRequestId(null)}
                                    onSubmit={() => {
                                        setQuotingRequestId(null);
                                        setRefresh(p => p + 1);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};

const QuoteForm: React.FC<{
    request: QuotationRequest;
    dealer: User;
    existingQuote?: any;
    onCancel: () => void;
    onSubmit: () => void;
}> = ({ request, dealer, existingQuote, onCancel, onSubmit }) => {
    const { t } = useLanguage();
    
    // Default to existing or 0
    const [exShowroom, setExShowroom] = useState(existingQuote?.exShowroomPrice || 0);
    const [rto, setRto] = useState(existingQuote?.rtoCharges || 0);
    const [insurance, setInsurance] = useState(existingQuote?.insurance || 0);
    const [accessories, setAccessories] = useState(existingQuote?.accessories || 0);
    const [discount, setDiscount] = useState(existingQuote?.discount || 0);
    const [notes, setNotes] = useState(existingQuote?.notes || '');

    const totalOnRoad = Number(exShowroom) + Number(rto) + Number(insurance) + Number(accessories);
    const finalPrice = totalOnRoad - Number(discount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        RequestService.submitQuote(
            request.id, 
            dealer, 
            {
                exShowroom: Number(exShowroom),
                rto: Number(rto),
                insurance: Number(insurance),
                accessories: Number(accessories),
                discount: Number(discount),
                notes
            }
        );
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide border-b pb-2">{t.draftingQuote} {request.customerName}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Ex-Showroom */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t.exShowroomInput}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input 
                            type="number" 
                            required
                            min="0"
                            className="pl-7 w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                            value={exShowroom}
                            onChange={(e) => setExShowroom(e.target.value)}
                        />
                    </div>
                </div>

                {/* RTO */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t.rtoInput}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input 
                            type="number" 
                            min="0"
                            className="pl-7 w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                            value={rto}
                            onChange={(e) => setRto(e.target.value)}
                        />
                    </div>
                </div>

                {/* Insurance */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t.insuranceInput}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input 
                            type="number" 
                            min="0"
                            className="pl-7 w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                            value={insurance}
                            onChange={(e) => setInsurance(e.target.value)}
                        />
                    </div>
                </div>

                {/* Accessories */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t.accessoriesInput}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input 
                            type="number" 
                            min="0"
                            className="pl-7 w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                            value={accessories}
                            onChange={(e) => setAccessories(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="p-3 bg-white rounded border border-gray-200 mb-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">{t.basePriceInput} (Pre-Discount):</span>
                <span className="text-lg font-bold text-gray-900">₹{totalOnRoad.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t.discountInput}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input 
                            type="number" 
                            min="0"
                            className="pl-7 w-full p-2 border border-red-200 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm bg-red-50"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{t.notesInput}</label>
                    <textarea 
                        className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm h-[38px] min-h-[38px] resize-none overflow-hidden"
                        rows={1}
                        placeholder={t.notesPlaceholder}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onFocus={(e) => e.target.style.height = '80px'}
                        onBlur={(e) => e.target.style.height = '38px'}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <div>
                    <span className="block text-xs text-gray-500 uppercase font-bold">Final Customer Price</span>
                    <span className="text-2xl font-bold text-green-700">₹{finalPrice.toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm transition-colors">{t.cancel}</button>
                    <button type="submit" className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded font-medium text-sm shadow-md transition-transform active:scale-95">{t.sendQuote}</button>
                </div>
            </div>
        </form>
    );
};

export default DealerDashboard;