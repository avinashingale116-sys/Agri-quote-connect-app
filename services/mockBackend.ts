import { User, UserRole, QuotationRequest, Quote, Tractor } from '../types';
import { MOCK_USERS, MOCK_TRACTORS } from '../constants';

const KEYS = {
  USERS: 'agriquote_users',
  REQUESTS: 'agriquote_requests',
  TRACTORS: 'agriquote_tractors',
  CURRENT_USER: 'agriquote_current_user'
};

// Initialize simulated DB
const initDB = () => {
  // Sync Users: Merge MOCK_USERS into LocalStorage
  // This ensures that when we add new dealers in code (like Vikas Sales), they appear in the app
  // even if the user has visited before.
  const storedUsers = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  const mergedUsers = [...storedUsers];
  
  MOCK_USERS.forEach(mockUser => {
    const index = mergedUsers.findIndex((u: User) => u.id === mockUser.id);
    if (index === -1) {
      // New mock user, add them
      mergedUsers.push(mockUser);
    } else {
      // Existing mock user, update them (to apply code changes like new brands)
      // We assume mock users (id starting with 'deal', 'admin', 'cust') should stay in sync with code
      if (mockUser.id.startsWith('deal') || mockUser.id.startsWith('admin') || mockUser.id.startsWith('cust')) {
        mergedUsers[index] = { ...mergedUsers[index], ...mockUser };
      }
    }
  });
  localStorage.setItem(KEYS.USERS, JSON.stringify(mergedUsers));

  // Sync Tractors: Ensure new tractors (Solis, Yanmar) are available
  const storedTractors = JSON.parse(localStorage.getItem(KEYS.TRACTORS) || '[]');
  const mergedTractors = [...storedTractors];
  
  MOCK_TRACTORS.forEach(mockTractor => {
    const index = mergedTractors.findIndex((t: Tractor) => t.id === mockTractor.id);
    if (index === -1) {
      mergedTractors.push(mockTractor);
    }
    // We don't overwrite existing tractors to preserve any simulated "edits" (though edit isn't fully implemented for tractors yet)
  });
  localStorage.setItem(KEYS.TRACTORS, JSON.stringify(mergedTractors));

  // Initialize Requests if empty
  if (!localStorage.getItem(KEYS.REQUESTS)) {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify([]));
  }
};

initDB();

export const UserService = {
  login: (mobile: string): User | null => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.mobile === mobile);
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: (user: User): User => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    
    // Check if user already exists
    const existing = users.find((u: User) => u.mobile === user.mobile);
    if (existing) {
        throw new Error('USER_EXISTS');
    }

    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getUser: (id: string): User | undefined => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    return users.find((u: User) => u.id === id);
  },

  getAllDealers: (): User[] => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    return users.filter((u: User) => u.role === UserRole.DEALER);
  },
  
  updateDealerStatus: (dealerId: string, isApproved: boolean) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === dealerId ? { ...u, isApproved } : u
    );
    localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
  },

  updateDealerBrands: (dealerId: string, brands: string[]) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === dealerId ? { ...u, brands } : u
    );
    localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
  }
};

export const TractorService = {
  getAll: (): Tractor[] => {
    return JSON.parse(localStorage.getItem(KEYS.TRACTORS) || '[]');
  },

  // Helper to get unique brands (Master Data) from the inventory
  getUniqueBrands: (): string[] => {
    const tractors = JSON.parse(localStorage.getItem(KEYS.TRACTORS) || '[]');
    const brands = new Set(tractors.map((t: Tractor) => t.brand));
    return Array.from(brands) as string[];
  },

  add: (tractor: Tractor): void => {
    const tractors = JSON.parse(localStorage.getItem(KEYS.TRACTORS) || '[]');
    tractors.push(tractor);
    localStorage.setItem(KEYS.TRACTORS, JSON.stringify(tractors));
  },

  delete: (id: string): void => {
    const tractors = JSON.parse(localStorage.getItem(KEYS.TRACTORS) || '[]');
    const filtered = tractors.filter((t: Tractor) => t.id !== id);
    localStorage.setItem(KEYS.TRACTORS, JSON.stringify(filtered));
  }
};

export const RequestService = {
  createRequest: (customerId: string, customerName: string, tractor: Tractor, district: string): QuotationRequest => {
    const requests = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    const newRequest: QuotationRequest = {
      id: `req_${Date.now()}`,
      customerId,
      customerName,
      tractorId: tractor.id,
      tractorSnapshot: tractor,
      district,
      status: 'OPEN' as any,
      createdAt: new Date().toISOString(),
      quotes: []
    };
    requests.push(newRequest);
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
    return newRequest;
  },

  getRequestsForCustomer: (customerId: string): QuotationRequest[] => {
    const requests = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    return requests.filter((r: QuotationRequest) => r.customerId === customerId).reverse();
  },

  getRequestsForDealer: (dealer: User): QuotationRequest[] => {
    // STRICT CHECK: Unapproved dealers see NOTHING
    if (dealer.role !== UserRole.DEALER || !dealer.isApproved || !dealer.brands) {
        return [];
    }
    
    const requests = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    
    // Logic: Dealer sees requests for brands they sell, in their district
    return requests.filter((r: QuotationRequest) => {
        const matchesBrand = dealer.brands?.includes(r.tractorSnapshot.brand);
        const matchesDistrict = dealer.district === r.district;
        return matchesBrand && matchesDistrict;
    }).reverse();
  },

  getAllRequests: (): QuotationRequest[] => {
    const requests = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    return requests.reverse();
  },

  submitQuote: (
    requestId: string, 
    dealer: User, 
    details: {
      exShowroom: number;
      rto: number;
      insurance: number;
      accessories: number;
      discount: number;
      notes: string;
    }
  ) => {
    // Double check approval just in case
    if (!dealer.isApproved) return;

    const basePrice = details.exShowroom + details.rto + details.insurance + details.accessories;

    const requests = JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
    const updatedRequests = requests.map((req: QuotationRequest) => {
      if (req.id === requestId) {
        const newQuote: Quote = {
          id: `qt_${Date.now()}`,
          requestId,
          dealerId: dealer.id,
          dealerName: dealer.name,
          dealerMobile: dealer.mobile,
          showroomName: dealer.showroomName || 'Unknown Showroom',
          
          exShowroomPrice: details.exShowroom,
          rtoCharges: details.rto,
          insurance: details.insurance,
          accessories: details.accessories,
          
          basePrice: basePrice, // Total On-Road
          discount: details.discount,
          finalPrice: basePrice - details.discount,
          notes: details.notes,
          submittedAt: new Date().toISOString()
        };
        // Check if dealer already quoted
        const existingQuoteIndex = req.quotes.findIndex(q => q.dealerId === dealer.id);
        if (existingQuoteIndex > -1) {
            req.quotes[existingQuoteIndex] = newQuote; // Update existing
        } else {
            req.quotes.push(newQuote);
        }
      }
      return req;
    });
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(updatedRequests));
  }
};