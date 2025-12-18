
import React, { useState, useEffect } from 'react';
import { User, QuotationRequest, Tractor, Quote } from '../types';
import { RequestService, TractorService, UserService } from '../services/mockBackend';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_LOGOS, BRAND_HERO_IMAGES } from '../constants';

interface Props {
  user: User;
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

const CustomerDashboard: React.FC<Props> = ({ user, onNavigate }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('list');
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [tractors, setTractors] = useState<Tractor[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(0);

  // New Request Form State
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState(''); // ID

  useEffect(() => {
    setRequests(RequestService.getRequestsForCustomer(user.id));
    const allTractors = TractorService.getAll();
    setTractors(allTractors);
    setAvailableBrands(TractorService.getUniqueBrands());
  }, [user.id, refresh]);

  const availableModels = tractors.filter(t => !selectedBrand || t.brand === selectedBrand);
  const selectedTractor = tractors.find(t => t.id === selectedModel);

  const handleSubmitRequest = () => {
    if (!selectedModel || !selectedTractor) return;
    RequestService.createRequest(user.id, user.name, selectedTractor, user.district);
    setRefresh(p => p + 1);
    setActiveTab('list');
    setSelectedBrand('');
    setSelectedModel('');
  };

  const generateQuotationPDF = (quote: Quote, request: QuotationRequest) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const customerUser = UserService.getUser(request.customerId);
    const dealerUser = UserService.getUser(quote.dealerId);
    const customerAddress = `${customerUser?.atPost || ''}, ${customerUser?.taluka || ''}, ${customerUser?.district || request.district}`;
    const dealerAddress = `${dealerUser?.atPost || ''}, ${dealerUser?.taluka || ''}, ${dealerUser?.district || ''}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quotation_${request.tractorSnapshot.model}_${quote.dealerName}</title>
        <style>
          @page { size: A4; margin: 0; }
          body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.4; }
          .page-border { border: 4px double #047857; padding: 40px; min-height: 297mm; box-sizing: border-box; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
          .dealer-info { text-align: right; }
          .dealer-info h1 { margin: 0; color: #111; font-size: 22px; }
          .auth-line { color: #047857; font-weight: bold; font-style: italic; font-size: 13px; margin-bottom: 5px; }
          .price-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .price-table th { background: #f4fdfa; text-align: left; padding: 12px; border-bottom: 2px solid #047857; }
          .price-table td { padding: 12px; border-bottom: 1px solid #eee; }
          .total-row { background: #047857; color: white; font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="page-border">
          <div class="header">
            <div>
              <h2 style="color: #047857; margin: 0;">AgriQuote Connect</h2>
              <p>ID: ${quote.id} | Date: ${new Date(quote.submittedAt).toLocaleDateString()}</p>
            </div>
            <div class="dealer-info">
              <h1>${quote.showroomName}</h1>
              <div class="auth-line">Authorized Dealer of ${request.tractorSnapshot.brand} Company</div>
              <p>${dealerAddress}<br>Contact: ${quote.dealerMobile || ''}</p>
            </div>
          </div>
          <div style="margin-bottom: 30px;">
            <h3>Customer: ${request.customerName}</h3>
            <p>Location: ${customerAddress}</p>
          </div>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 5px solid #047857;">
            <h2 style="margin: 0;">${request.tractorSnapshot.brand} ${request.tractorSnapshot.model}</h2>
            <p>${request.tractorSnapshot.variant} | ${request.tractorSnapshot.hp} HP</p>
          </div>
          <table class="price-table">
            <thead>
              <tr><th>Description</th><th style="text-align: right;">Amount (₹)</th></tr>
            </thead>
            <tbody>
              <tr><td>Ex-Showroom Price</td><td style="text-align: right;">${quote.exShowroomPrice.toLocaleString()}</td></tr>
              <tr><td>RTO & Registration</td><td style="text-align: right;">${quote.rtoCharges.toLocaleString()}</td></tr>
              <tr><td>Insurance</td><td style="text-align: right;">${quote.insurance.toLocaleString()}</td></tr>
              <tr><td>Accessories</td><td style="text-align: right;">${quote.accessories.toLocaleString()}</td></tr>
              <tr style="font-weight: bold;"><td>Subtotal (On-Road)</td><td style="text-align: right;">${quote.basePrice.toLocaleString()}</td></tr>
              <tr style="color: #dc2626;"><td>Discount</td><td style="text-align: right;">- ${quote.discount.toLocaleString()}</td></tr>
              <tr class="total-row"><td>FINAL OFFER</td><td style="text-align: right;">₹${quote.finalPrice.toLocaleString()}</td></tr>
            </tbody>
          </table>
          <p style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;">This is a computer-generated quotation via AgriQuote Connect platform.</p>
        </div>
        <script>window.onload = function() { setTimeout(() => window.print(), 500); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex space-x-4">
            <button
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${activeTab === 'list' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('list')}
            >
            {t.myQuotations}
            </button>
            <button
            className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${activeTab === 'new' ? 'bg-green-100 text-green-800' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('new')}
            >
            {t.requestNewQuote}
            </button>
        </div>
        <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all border border-gray-200"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            {t.home}
        </button>
      </div>

      {activeTab === 'new' && (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.selectTractor}</h3>
                <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.brandFilter}</label>
                    <select
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
                    value={selectedBrand}
                    onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedModel('');
                    }}
                    >
                    <option value="">{t.allBrands}</option>
                    {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.model}</label>
                    <select
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    >
                    <option value="">{t.selectModel}</option>
                    {availableModels.map(t => (
                        <option key={t.id} value={t.id}>{t.brand} {t.model} ({t.hp} HP)</option>
                    ))}
                    </select>
                </div>
                <button
                    disabled={!selectedModel}
                    onClick={handleSubmitRequest}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-colors shadow-lg shadow-orange-200"
                >
                    {t.submitRequest} {user.district}
                </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
                {selectedTractor ? (
                    <div className="w-full h-full flex flex-col animate-fade-in">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <h4 className="text-3xl font-bold text-gray-900 leading-tight">{selectedTractor.brand} {selectedTractor.model}</h4>
                            {BRAND_LOGOS[selectedTractor.brand] && (
                                <img src={BRAND_LOGOS[selectedTractor.brand]} alt="logo" className="h-12 w-auto object-contain ml-4 bg-white p-1 rounded" />
                            )}
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                                <h5 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 border-dashed">Technical Specifications</h5>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div><span className="text-xs font-semibold text-gray-500 uppercase block mb-1">{t.make}</span><span className="text-lg font-medium">{selectedTractor.brand}</span></div>
                                    <div><span className="text-xs font-semibold text-gray-500 uppercase block mb-1">{t.model}</span><span className="text-lg font-medium">{selectedTractor.model}</span></div>
                                    <div><span className="text-xs font-semibold text-gray-500 uppercase block mb-1">{t.power}</span><span className="text-lg font-medium">{selectedTractor.hp} {t.hp}</span></div>
                                    <div><span className="text-xs font-semibold text-gray-500 uppercase block mb-1">{t.variant}</span><span className="text-lg font-medium">{selectedTractor.variant}</span></div>
                                </div>
                            </div>
                            {selectedTractor.youtubeId && (
                                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                                    <h5 className="text-lg font-bold text-gray-900 mb-2">Watch Performance Video</h5>
                                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedTractor.youtubeId}`} frameBorder="0" allowFullScreen></iframe>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 p-6 flex flex-col items-center justify-center h-full">
                         {selectedBrand && BRAND_HERO_IMAGES[selectedBrand] ? (
                            <img src={BRAND_HERO_IMAGES[selectedBrand]} className="w-full h-48 rounded-xl object-cover mb-4 shadow" />
                         ) : <div className="text-6xl mb-4 opacity-20">🚜</div>}
                         <p className="text-lg font-medium text-gray-500">{selectedBrand ? t.selectModel : t.selectTractor}</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-500">{t.noRequests}</div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {BRAND_LOGOS[req.tractorSnapshot.brand] && <img src={BRAND_LOGOS[req.tractorSnapshot.brand]} className="h-6 object-contain" alt="brand" />}
                    <h3 className="font-bold">{req.tractorSnapshot.brand} {req.tractorSnapshot.model} ({req.tractorSnapshot.hp} HP)</h3>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{req.quotes.length} {t.quotesReceived}</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {req.quotes.map(quote => (
                    <div key={quote.id} className="border rounded-lg p-4 bg-white flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{quote.showroomName}</h4>
                        <p className="text-xs text-green-700 font-bold italic mb-3">Authorized Dealer of {req.tractorSnapshot.brand} Company</p>
                        <div className="text-2xl font-black text-gray-900 mb-2">₹{quote.finalPrice.toLocaleString()}</div>
                      </div>
                      <div className="pt-4 mt-4 border-t flex gap-2">
                        <button onClick={() => generateQuotationPDF(quote, req)} className="flex-1 bg-gray-100 py-2 rounded text-xs font-bold hover:bg-gray-200">{t.printQuote}</button>
                        <a href={`tel:${quote.dealerMobile}`} className="flex-1 bg-green-600 text-white py-2 rounded text-xs font-bold text-center hover:bg-green-700">{t.callDealer}</a>
                      </div>
                    </div>
                  ))}
                  {req.quotes.length === 0 && <p className="text-gray-400 italic text-sm col-span-full">{t.waitingForDealers} {req.district}...</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
