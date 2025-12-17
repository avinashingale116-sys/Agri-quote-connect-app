import React, { useState, useEffect } from 'react';
import { User, QuotationRequest, Tractor, Quote } from '../types';
import { RequestService, TractorService, UserService } from '../services/mockBackend';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

const BRAND_LOGOS: Record<string, string> = {
  'Mahindra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Mahindra_Rise_logo.svg/320px-Mahindra_Rise_logo.svg.png',
  'John Deere': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/John_Deere_logo.svg/320px-John_Deere_logo.svg.png',
  'Swaraj': 'https://upload.wikimedia.org/wikipedia/en/1/18/Swaraj_Tractors_logo.png',
  'Sonalika': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Sonalika_Tractors_logo.png/320px-Sonalika_Tractors_logo.png',
  'Kubota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Kubota_logo.svg/320px-Kubota_logo.svg.png',
  'New Holland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/New_Holland_Agriculture_logo.svg/320px-New_Holland_Agriculture_logo.svg.png',
  'Farmtrac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Farmtrac_Tractors_Europe_logo.png/320px-Farmtrac_Tractors_Europe_logo.png',
  'Solis': 'https://solisworld.com/wp-content/uploads/2021/08/Solis-Logo-Header.png',
  'Yanmar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Yanmar_Logo.svg/320px-Yanmar_Logo.svg.png',
  'Eicher': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Eicher_Logo_2016.svg/320px-Eicher_Logo_2016.svg.png',
  'Cooper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Cooper_Corporation_logo.png/320px-Cooper_Corporation_logo.png'
};

const BRAND_HERO_IMAGES: Record<string, string> = {
  'Mahindra': 'https://images.unsplash.com/photo-1605218427306-0335808b871d?q=80&w=1000&auto=format&fit=crop',
  'John Deere': 'https://images.unsplash.com/photo-1560706834-192629732152?q=80&w=1000&auto=format&fit=crop',
  'Sonalika': 'https://images.unsplash.com/photo-1592912388091-a20c74da05df?q=80&w=1000&auto=format&fit=crop',
  'Kubota': 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1000&auto=format&fit=crop',
  'New Holland': 'https://images.unsplash.com/photo-1530267981375-2734035bd5f5?q=80&w=1000&auto=format&fit=crop',
  'Swaraj': 'https://images.unsplash.com/photo-1589923188900-85dae5233271?q=80&w=1000&auto=format&fit=crop'
};

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

  return (
    <div className="space-y-6">
      {/* Home Button and Tabs */}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.home}
        </button>
      </div>

      {activeTab === 'new' && (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: Selection Form */}
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

            {/* Right Column: Specifications & YouTube Display (No Tractor Image) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
                {selectedTractor ? (
                    <div className="w-full h-full flex flex-col animate-fade-in">
                         {/* Brand Logo Header */}
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <h4 className="text-3xl font-bold text-gray-900 leading-tight">
                                {selectedTractor.brand} {selectedTractor.model}
                            </h4>
                            {BRAND_LOGOS[selectedTractor.brand] && (
                                <img 
                                    src={BRAND_LOGOS[selectedTractor.brand]} 
                                    alt={`${selectedTractor.brand} logo`} 
                                    className="h-16 w-auto object-contain ml-4 bg-white p-1 rounded"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                            )}
                        </div>

                        <div className="flex-grow overflow-y-auto">
                            {/* Specifications Table */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                                <h5 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2 border-dashed">Technical Specifications</h5>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">{t.make}</span>
                                        <span className="text-lg text-gray-900 font-medium">{selectedTractor.brand}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">{t.model}</span>
                                        <span className="text-lg text-gray-900 font-medium">{selectedTractor.model}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">{t.power}</span>
                                        <span className="text-lg text-gray-900 font-medium">{selectedTractor.hp} {t.hp}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">{t.variant}</span>
                                        <span className="text-lg text-gray-900 font-medium">{selectedTractor.variant}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">{t.fuel}</span>
                                        <span className="text-lg text-gray-900 font-medium">{t.diesel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* YouTube Link / Embed */}
                            <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex flex-col items-center text-center">
                                <div className="text-red-600 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                    </svg>
                                </div>
                                <h5 className="text-lg font-bold text-gray-900 mb-2">Watch Review & Performance</h5>
                                <p className="text-sm text-gray-600 mb-4">See the {selectedTractor.brand} {selectedTractor.model} in action on YouTube.</p>
                                
                                {selectedTractor.youtubeId ? (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-2">
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={`https://www.youtube.com/embed/${selectedTractor.youtubeId}`} 
                                            title="YouTube video player" 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <a 
                                        href={`https://www.youtube.com/results?search_query=${selectedTractor.brand}+${selectedTractor.model}+tractor+review`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-md"
                                    >
                                        <span>Watch on YouTube</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 p-6 flex flex-col items-center justify-center h-full">
                         {selectedBrand && BRAND_LOGOS[selectedBrand] ? (
                            <div className="flex flex-col items-center w-full animate-fade-in">
                                <div className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full flex justify-center">
                                    <img 
                                        src={BRAND_LOGOS[selectedBrand]} 
                                        alt={`${selectedBrand} logo`} 
                                        className="h-20 w-auto object-contain"
                                    />
                                </div>
                                {BRAND_HERO_IMAGES[selectedBrand] && (
                                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-md mb-4 relative">
                                        <img 
                                            src={BRAND_HERO_IMAGES[selectedBrand]} 
                                            alt={`${selectedBrand} Tractor`} 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                            <span className="text-white font-bold text-lg">{selectedBrand} Tractors</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                         ) : (
                             <div className="text-6xl mb-4 opacity-20">🚜</div>
                         )}
                         <p className="text-lg font-medium text-gray-500">
                            {selectedBrand ? t.selectModel : t.selectTractor}
                         </p>
                         <p className="text-sm mt-2 opacity-60">
                             {selectedBrand 
                                ? `Select a model to view specifications for ${selectedBrand}.` 
                                : "Select a brand and model to view specifications, logo, and image."
                             }
                         </p>
                    </div>
                )}
            </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl">
              <p className="text-gray-500">{t.noRequests}</p>
              <button onClick={() => setActiveTab('new')} className="text-green-600 font-medium mt-2 hover:underline">{t.startNow}</button>
            </div>
          ) : (
            requests.map(req => (
              <RequestCard key={req.id} request={req} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const RequestCard: React.FC<{ request: QuotationRequest }> = ({ request }) => {
    const { t } = useLanguage();
    const [revealedDealers, setRevealedDealers] = useState<Set<string>>(new Set());
    const [confirmingDealerId, setConfirmingDealerId] = useState<string | null>(null);

    const toggleReveal = (dealerId: string) => {
        const newSet = new Set(revealedDealers);
        newSet.add(dealerId);
        setRevealedDealers(newSet);
    };

    const generateQuotationPDF = (quote: Quote, request: QuotationRequest) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        // Fetch full customer and dealer objects for complete address info
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
              body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; background: #fff; line-height: 1.4; }
              .page-border { border: 4px double #047857; padding: 40px; min-height: calc(100vh - 88px); box-sizing: border-box; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
              .brand-title { font-size: 28px; font-weight: 900; color: #047857; text-transform: uppercase; letter-spacing: 1px; }
              .meta-info { text-align: left; font-size: 13px; color: #666; margin-top: 10px; }
              
              .dealer-corner { text-align: right; max-width: 300px; }
              .dealer-corner .firm-name { font-size: 18px; font-weight: bold; color: #111; margin-bottom: 4px; }
              .dealer-corner .contact-info { font-size: 13px; color: #444; }

              .section { margin-bottom: 30px; }
              .section-title { font-size: 14px; font-weight: bold; color: #047857; border-bottom: 2px solid #047857; display: inline-block; padding-bottom: 2px; margin-bottom: 15px; text-transform: uppercase; }
              
              .info-grid { display: flex; justify-content: space-between; margin-bottom: 40px; gap: 40px; }
              .info-box { flex: 1; }
              .info-box p { margin: 2px 0; font-size: 14px; }
              .info-box .label { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; display: block; margin-top: 10px; }

              .price-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              .price-table th { text-align: left; padding: 12px 10px; background: #f4fdfa; border-bottom: 2px solid #047857; font-size: 13px; }
              .price-table td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 14px; }
              .price-table .subtotal { font-weight: bold; background-color: #f9fafb; }
              .price-table .discount-row { color: #dc2626; font-weight: bold; }
              .total-row { font-weight: bold; font-size: 20px; color: #fff; background-color: #047857 !important; }
              .total-row td { border: none; padding: 15px 10px; }

              .tractor-details { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 5px solid #047857; }
              .tractor-details h2 { margin: 0 0 5px 0; color: #111; font-size: 22px; }
              .tractor-details p { margin: 0; color: #666; font-size: 14px; }

              .notes-box { background: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 6px; font-size: 13px; color: #92400e; margin-top: 20px; }
              .footer { position: absolute; bottom: 60px; left: 60px; right: 60px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="page-border">
              <div class="header">
                <div>
                  <div class="brand-title">AgriQuote Connect</div>
                  <div class="meta-info">
                    <p><strong>Date:</strong> ${new Date(quote.submittedAt).toLocaleDateString()}</p>
                    <p><strong>Quotation ID:</strong> ${quote.id}</p>
                  </div>
                </div>
                <div class="dealer-corner">
                  <div class="firm-name">${quote.showroomName}</div>
                  <div class="contact-info">
                    <p><strong>Dealer:</strong> ${quote.dealerName}</p>
                    <p>${dealerAddress}</p>
                    <p><strong>Mob:</strong> ${quote.dealerMobile || dealerUser?.mobile || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-box">
                  <div class="section-title">Customer Information</div>
                  <p><strong>Name:</strong> ${request.customerName}</p>
                  <p><strong>Address:</strong> ${customerAddress}</p>
                  <p><strong>Mobile:</strong> ${customerUser?.mobile || 'N/A'}</p>
                </div>
                <div class="info-box">
                   <!-- Reserved for extra spacing or terms -->
                </div>
              </div>

              <div class="section">
                <div class="section-title">Vehicle Specifications</div>
                <div class="tractor-details">
                   <h2>${request.tractorSnapshot.brand} ${request.tractorSnapshot.model}</h2>
                   <p><strong>Variant:</strong> ${request.tractorSnapshot.variant} | <strong>Power Class:</strong> ${request.tractorSnapshot.hp} HP</p>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Pricing & Offer Details</div>
                <table class="price-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style="text-align: right;">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ex-Showroom Price</td>
                      <td style="text-align: right;">₹${(quote.exShowroomPrice || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Registration / RTO Charges</td>
                      <td style="text-align: right;">₹${(quote.rtoCharges || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Insurance Premium</td>
                      <td style="text-align: right;">₹${(quote.insurance || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Accessories & Kit</td>
                      <td style="text-align: right;">₹${(quote.accessories || 0).toLocaleString()}</td>
                    </tr>
                    <tr class="subtotal">
                      <td>Total On-Road Value</td>
                      <td style="text-align: right;">₹${quote.basePrice.toLocaleString()}</td>
                    </tr>
                    <tr class="discount-row">
                      <td>Special Discount / Promotional Benefits</td>
                      <td style="text-align: right;">- ₹${quote.discount.toLocaleString()}</td>
                    </tr>
                    <tr class="total-row">
                      <td>FINAL OFFER PRICE</td>
                      <td style="text-align: right;">₹${quote.finalPrice.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              ${quote.notes ? `
              <div class="section">
                <div class="section-title">Notes & Terms</div>
                <div class="notes-box">${quote.notes}</div>
              </div>
              ` : ''}

              <div class="footer">
                <p>This is a digital quotation generated via the AgriQuote Connect Platform.</p>
                <p>Prices listed are subject to final confirmation by the dealer at the time of purchase.</p>
                <p>&copy; ${new Date().getFullYear()} AgriQuote Connect - Empowering Rural India</p>
              </div>
            </div>

            <script>
              window.onload = function() { 
                setTimeout(() => { window.print(); }, 500);
              }
            </script>
          </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h4 className="font-bold text-xl text-gray-900">{request.tractorSnapshot.brand} {request.tractorSnapshot.model}</h4>
                        <div className="flex gap-2 mt-1">
                             <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold">{request.tractorSnapshot.variant}</span>
                             <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">{request.tractorSnapshot.hp} HP</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 font-medium">{t.requestedOn} {new Date(request.createdAt).toLocaleDateString()} • {request.district}</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold shadow-sm">
                    {request.quotes.length} {t.quotesReceived}
                </div>
            </div>
            
            <div className="divide-y">
                {request.quotes.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm italic">
                        {t.waitingForDealers} {request.district}...
                    </div>
                ) : (
                    request.quotes.map(quote => {
                        // Dynamically determine the mobile number. 
                        // Prioritize the number stored in the quote, fallback to live user data if available.
                        const dealerMobile = quote.dealerMobile || UserService.getUser(quote.dealerId)?.mobile || '9999999999';

                        return (
                        <div key={quote.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="font-bold text-lg text-gray-900">{quote.showroomName}</p>
                                    
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600 mt-2">
                                        <span>{t.exShowroomLabel}:</span>
                                        <span className="font-medium text-right">₹{(quote.exShowroomPrice || 0).toLocaleString()}</span>
                                        
                                        <span>{t.rtoLabel}:</span>
                                        <span className="font-medium text-right">₹{(quote.rtoCharges || 0).toLocaleString()}</span>
                                        
                                        <span>{t.insuranceLabel}:</span>
                                        <span className="font-medium text-right">₹{(quote.insurance || 0).toLocaleString()}</span>
                                        
                                        <span>{t.accessoriesLabel}:</span>
                                        <span className="font-medium text-right">₹{(quote.accessories || 0).toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 my-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-800">{t.basePriceLabel}</span>
                                            <span className="font-bold text-gray-800">₹{quote.basePrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-red-600">
                                            <span className="font-medium">{t.discountLabel}</span>
                                            <span className="font-bold">-₹{quote.discount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-green-50 p-2 rounded border border-green-100 mt-2">
                                        <span className="font-bold text-green-900">{t.finalOfferLabel}</span>
                                        <span className="font-bold text-xl text-green-800">₹{quote.finalPrice.toLocaleString()}</span>
                                    </div>

                                    {quote.notes && (
                                        <div className="mt-2 bg-yellow-50 p-2 rounded text-xs text-yellow-800 border border-yellow-100 italic">
                                            {t.noteLabel} {quote.notes}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right flex flex-col items-end gap-2 pl-4 border-l ml-4 min-w-[140px]">
                                    <button
                                        onClick={() => generateQuotationPDF(quote, request)}
                                        className="w-full text-gray-600 hover:text-green-700 text-sm flex items-center justify-center gap-2 font-medium border px-3 py-2 rounded bg-white shadow-sm transition-colors hover:bg-gray-50"
                                        title="Download/Print PDF"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        {t.printQuote}
                                    </button>

                                    {revealedDealers.has(quote.dealerId) ? (
                                        <div className="w-full bg-green-50 p-3 rounded border border-green-200 text-sm animate-fade-in text-center">
                                            <p className="font-bold text-green-800">{t.contactDetails}</p>
                                            <p className="text-gray-800 text-xs mb-1">{quote.dealerName}</p>
                                            <a href={`tel:${dealerMobile}`} className="text-white bg-green-600 px-3 py-1 rounded-full text-xs hover:bg-green-700 block">📞 Call</a>
                                        </div>
                                    ) : confirmingDealerId === quote.dealerId ? (
                                        <div className="w-full bg-yellow-50 p-2 rounded border border-yellow-200 text-sm animate-fade-in">
                                            <p className="font-medium text-yellow-800 mb-2 text-xs text-center">{t.confirmContactMsg}</p>
                                            <div className="flex gap-1 justify-center">
                                                <button 
                                                    onClick={() => setConfirmingDealerId(null)}
                                                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs font-bold hover:bg-gray-400"
                                                >
                                                    ✕
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        toggleReveal(quote.dealerId);
                                                        setConfirmingDealerId(null);
                                                    }}
                                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-700"
                                                >
                                                    ✓
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setConfirmingDealerId(quote.dealerId)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded shadow transition-colors"
                                        >
                                            {t.contactDealer}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )})
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;