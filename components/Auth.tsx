import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { DISTRICTS, MAHARASHTRA_TALUKAS } from '../constants';
import { UserService, TractorService } from '../services/mockBackend';
import { useLanguage } from '../contexts/LanguageContext';

export interface AutofillData {
  mobile: string;
  role: UserRole;
  timestamp: number;
}

interface AuthProps {
  onLogin: (user: User) => void;
  autofill?: AutofillData;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, autofill }) => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    role: UserRole.CUSTOMER,
    atPost: '',
    taluka: '',
    district: DISTRICTS[0],
    showroomName: '',
    brandSelection: [] as string[]
  });
  const [error, setError] = useState('');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableTalukas, setAvailableTalukas] = useState<string[]>([]);

  useEffect(() => {
    // Fetch unique brands dynamically created by Admin
    setAvailableBrands(TractorService.getUniqueBrands());
  }, []);

  // Update available Talukas when District changes
  useEffect(() => {
    const talukas = MAHARASHTRA_TALUKAS[formData.district] || [];
    setAvailableTalukas(talukas);
  }, [formData.district]);

  // Handle Autofill from Footer Quick Links
  useEffect(() => {
    if (autofill) {
        setFormData(prev => ({
            ...prev,
            mobile: autofill.mobile,
            role: autofill.role
        }));
        setIsLogin(true);
        setError('');
    }
  }, [autofill]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        // Reset Taluka if District changes
        if (name === 'district') {
            newData.taluka = '';
        }
        return newData;
    });
  };

  const handleBrandToggle = (brand: string) => {
    setFormData(prev => {
      const brands = prev.brandSelection.includes(brand)
        ? prev.brandSelection.filter(b => b !== brand)
        : [...prev.brandSelection, brand];
      return { ...prev, brandSelection: brands };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Simulation Login
      const user = UserService.login(formData.mobile);
      if (user) {
        onLogin(user);
      } else {
        setError(t.userNotFound);
      }
    } else {
      // Registration
      if (!formData.mobile || !formData.name) {
        setError(t.fillAllFields);
        return;
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: formData.name,
        mobile: formData.mobile,
        role: formData.role,
        atPost: formData.atPost,
        taluka: formData.taluka,
        district: formData.district,
        ...(formData.role === UserRole.DEALER && {
          showroomName: formData.showroomName,
          brands: formData.brandSelection,
          isApproved: false // Auto-approved for demo? Lets keep false and let admin approve
        })
      };

      try {
        UserService.register(newUser);
        onLogin(newUser);
      } catch (err: any) {
        if (err.message === 'USER_EXISTS') {
            setError(t.userExists);
        } else {
            setError('Registration failed');
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-lg mt-10">
      <div className="bg-green-600 py-4 px-6">
        <h2 className="text-2xl font-bold text-white text-center">
          {isLogin ? t.welcomeBack : t.createAccount}
        </h2>
      </div>
      <div className="p-6">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.fullName}</label>
              <input
                type="text"
                name="name"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-green-500 focus:ring-green-500"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">{t.mobileNumber}</label>
            <input
              type="tel"
              name="mobile"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-green-500 focus:ring-green-500"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              placeholder="e.g. 9876543210"
            />
          </div>

          {!isLogin && (
             <div>
               <label className="block text-sm font-medium text-gray-700">{t.role}</label>
               <div className="flex gap-4 mt-2">
                 <label className="flex items-center">
                   <input
                     type="radio"
                     name="role"
                     value={UserRole.CUSTOMER}
                     checked={formData.role === UserRole.CUSTOMER}
                     onChange={() => setFormData({...formData, role: UserRole.CUSTOMER})}
                     className="mr-2 text-green-600 focus:ring-green-500"
                   />
                   {t.farmer}
                 </label>
                 <label className="flex items-center">
                   <input
                     type="radio"
                     name="role"
                     value={UserRole.DEALER}
                     checked={formData.role === UserRole.DEALER}
                     onChange={() => setFormData({...formData, role: UserRole.DEALER})}
                     className="mr-2 text-green-600 focus:ring-green-500"
                   />
                   {t.dealer}
                 </label>
               </div>
             </div>
          )}

          {!isLogin && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.addressDetails}</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                 <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.district}</label>
                    <select
                        name="district"
                        className="block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-green-500 focus:ring-green-500"
                        value={formData.district}
                        onChange={handleInputChange}
                    >
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t.taluka}</label>
                    <select
                        name="taluka"
                        className="block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-green-500 focus:ring-green-500"
                        value={formData.taluka}
                        onChange={handleInputChange}
                        required={!isLogin}
                        disabled={availableTalukas.length === 0}
                    >
                        <option value="">Select Taluka</option>
                        {availableTalukas.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                 </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t.atPost}</label>
                <input
                    type="text"
                    name="atPost"
                    placeholder="Village"
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-green-500 focus:ring-green-500"
                    value={formData.atPost}
                    onChange={handleInputChange}
                    required={!isLogin}
                />
              </div>
            </div>
          )}

          {!isLogin && formData.role === UserRole.DEALER && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.showroomName}</label>
                <input
                  type="text"
                  name="showroomName"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-green-500 focus:ring-green-500"
                  value={formData.showroomName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.dealershipBrands}
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded">
                  {availableBrands.length === 0 ? (
                      <p className="text-xs text-gray-500 col-span-2">No brands added by Admin yet.</p>
                  ) : (
                    availableBrands.map(brand => (
                        <label key={brand} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.brandSelection.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span>{brand}</span>
                        </label>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-6"
          >
            {isLogin ? t.loginBtn : t.registerBtn}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
            }}
            className="text-sm text-green-600 hover:text-green-500 font-medium"
          >
            {isLogin ? t.noAccount : t.haveAccount}
          </button>
        </div>
      </div>
    </div>
  );
};