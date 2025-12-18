import { User, UserRole, Tractor } from './types';

export const DISTRICTS = ['Satara', 'Pune', 'Sangli', 'Kolhapur', 'Nashik'];

export const MAHARASHTRA_TALUKAS: Record<string, string[]> = {
  'Satara': ['Satara', 'Karad', 'Wai', 'Mahabaleshwar', 'Phaltan', 'Man', 'Khatav', 'Koregaon', 'Patan', 'Jaoli', 'Khandala'],
  'Pune': ['Pune City', 'Haveli', 'Khed', 'Baramati', 'Junnar', 'Shirur', 'Indapur', 'Daund', 'Maval', 'Mulshi', 'Bhor', 'Velhe', 'Purandar', 'Ambegaon'],
  'Sangli': ['Miraj', 'Tasgaon', 'Kavathe Mahankal', 'Jat', 'Walwa', 'Khanapur', 'Shirala', 'Atpadi', 'Palus', 'Kadegaon'],
  'Kolhapur': ['Karvir', 'Panhala', 'Shahuwadi', 'Kagal', 'Hatkanangale', 'Shirol', 'Radhanagari', 'Gaganbavada', 'Bhudargad', 'Gadhinglaj', 'Chandgad', 'Ajara'],
  'Nashik': ['Nashik', 'Baglan', 'Malegaon', 'Sinnar', 'Niphad', 'Dindori', 'Igatpuri', 'Trimbakeshwar', 'Kalwan', 'Deola', 'Surgana', 'Peint', 'Chandwad', 'Nandgaon', 'Yeola']
};

export const TRACTOR_BRANDS = ['Mahindra', 'John Deere', 'Swaraj', 'Sonalika', 'Kubota', 'Solis', 'Yanmar', 'New Holland', 'Farmtrac', 'Cooper', 'Eicher'];

export const MOCK_TRACTORS: Tractor[] = [
  // --- Mahindra JIVO Series (Mini Tractors) ---
  {
    id: 'mah_jivo_225',
    brand: 'Mahindra',
    model: 'JIVO 225 DI',
    variant: '4WD',
    hp: 20,
    image: 'https://images.unsplash.com/photo-1605218427306-0335808b871d?q=80&w=600&auto=format&fit=crop',
    youtubeId: 'Sg_J1_2Wv_8'
  },
  {
    id: 't2',
    brand: 'Mahindra',
    model: 'JIVO 245 DI',
    variant: '4WD',
    hp: 24,
    image: 'https://images.unsplash.com/photo-1517643509493-9c8f61555a6d?q=80&w=600&auto=format&fit=crop',
    youtubeId: 'qQJvJ5x1i2c'
  },
  {
    id: 'mah_jivo_305',
    brand: 'Mahindra',
    model: 'JIVO 305 DI',
    variant: '4WD',
    hp: 30,
    image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600&auto=format&fit=crop'
  },

  // --- Mahindra XP PLUS Series ---
  {
    id: 'mah_275_xp',
    brand: 'Mahindra',
    model: '275 DI XP Plus',
    variant: '2WD',
    hp: 37,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae5233271?q=80&w=600&auto=format&fit=crop',
    youtubeId: 'b7u4a5z1y2c'
  },
  {
    id: 'mah_475_xp',
    brand: 'Mahindra',
    model: '475 DI XP Plus',
    variant: '2WD',
    hp: 44,
    image: 'https://images.unsplash.com/photo-1532408840135-24b5a3e14442?q=80&w=600&auto=format&fit=crop',
    youtubeId: 'j8k2l3m4n5o'
  },
  {
    id: 't1',
    brand: 'Mahindra',
    model: '575 DI XP Plus',
    variant: '2WD',
    hp: 47,
    image: 'https://images.unsplash.com/photo-1530267981375-2734035bd5f5?q=80&w=600&auto=format&fit=crop',
    youtubeId: '9p8q7r6s5t4'
  },

  // --- Swaraj Series ---
  {
    id: 'swaraj_735_fe',
    brand: 'Swaraj',
    model: '735 FE',
    variant: '2WD',
    hp: 40,
    image: 'https://images.unsplash.com/photo-1532408840135-24b5a3e14442?q=80&w=600&auto=format&fit=crop',
    youtubeId: 'a1b2c3d4e5f'
  },
  {
    id: 't4',
    brand: 'Swaraj',
    model: '744 FE',
    variant: '2WD',
    hp: 48,
    image: 'https://images.unsplash.com/photo-1562657520-05e94b2a4778?q=80&w=600&auto=format&fit=crop',
    youtubeId: 'g6h7i8j9k0l'
  },
  {
    id: 'swaraj_855_fe',
    brand: 'Swaraj',
    model: '855 FE',
    variant: '2WD',
    hp: 52,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop',
    youtubeId: 'm1n2o3p4q5r'
  },

  // --- John Deere Series ---
  {
    id: 'jd_5050_d',
    brand: 'John Deere',
    model: '5050 D',
    variant: 'GearPro',
    hp: 50,
    image: 'https://images.unsplash.com/photo-1560706834-192629732152?q=80&w=600&auto=format&fit=crop',
    youtubeId: 's6t7u8v9w0x'
  },
  {
    id: 't3',
    brand: 'John Deere',
    model: '5310',
    variant: 'Trem IV',
    hp: 55,
    image: 'https://picsum.photos/400/300?random=3',
    youtubeId: 'y1z2a3b4c5d'
  },
  {
    id: 'jd_5105',
    brand: 'John Deere',
    model: '5105',
    variant: '4WD',
    hp: 40,
    image: 'https://images.unsplash.com/photo-1560706834-192629732152?q=80&w=600&auto=format&fit=crop'
  },

  // --- Sonalika Series ---
  {
    id: 'son_di_35',
    brand: 'Sonalika',
    model: 'DI 35',
    variant: 'Sikander',
    hp: 39,
    image: 'https://picsum.photos/400/300?random=5'
  },
  {
    id: 'son_tiger_55',
    brand: 'Sonalika',
    model: 'Tiger 55',
    variant: '4WD',
    hp: 55,
    image: 'https://images.unsplash.com/photo-1560706834-192629732152?q=80&w=600&auto=format&fit=crop'
  },

  // --- New Holland Series ---
  {
    id: 'nh_3630_tx',
    brand: 'New Holland',
    model: '3630 TX Super Plus',
    variant: '2WD',
    hp: 50,
    image: 'https://images.unsplash.com/photo-1592912388091-a20c74da05df?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nh_3230_nx',
    brand: 'New Holland',
    model: '3230 NX',
    variant: '2WD',
    hp: 42,
    image: 'https://images.unsplash.com/photo-1530267981375-2734035bd5f5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nh_5620_tx',
    brand: 'New Holland',
    model: '5620 TX Plus',
    variant: '4WD',
    hp: 65,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nh_3037_tx',
    brand: 'New Holland',
    model: '3037 TX',
    variant: '2WD',
    hp: 39,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop'
  },

  // --- Kubota Series ---
  {
    id: 'kub_mu4501',
    brand: 'Kubota',
    model: 'MU4501',
    variant: '2WD',
    hp: 45,
    image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'kub_mu5501',
    brand: 'Kubota',
    model: 'MU5501',
    variant: '4WD',
    hp: 55,
    image: 'https://images.unsplash.com/photo-1519757062489-f53835f8e5ee?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'kub_neostar_a211n',
    brand: 'Kubota',
    model: 'NeoStar A211N',
    variant: '4WD',
    hp: 21,
    image: 'https://images.unsplash.com/photo-1605218427306-0335808b871d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'kub_l4508',
    brand: 'Kubota',
    model: 'L4508',
    variant: '4WD',
    hp: 45,
    image: 'https://images.unsplash.com/photo-1524514587602-c8a523b0dc2d?q=80&w=600&auto=format&fit=crop'
  },

  // --- Farmtrac Series ---
  {
    id: 'ft_60_powermaxx',
    brand: 'Farmtrac',
    model: '60 Powermaxx',
    variant: '2WD',
    hp: 55,
    image: 'https://images.unsplash.com/photo-1562657520-05e94b2a4778?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ft_45_classic',
    brand: 'Farmtrac',
    model: '45 Classic',
    variant: '2WD',
    hp: 45,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae5233271?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ft_atom_26',
    brand: 'Farmtrac',
    model: 'Atom 26',
    variant: '4WD',
    hp: 26,
    image: 'https://images.unsplash.com/photo-1517643509493-9c8f61555a6d?q=80&w=600&auto=format&fit=crop'
  },

  // --- Cooper Series ---
  {
    id: 'cooper_eco_pack',
    brand: 'Cooper',
    model: 'Corp Eco Pack',
    variant: '2WD',
    hp: 26,
    image: 'https://images.unsplash.com/photo-1517427677506-ade074eb1432?q=80&w=600&auto=format&fit=crop'
  },

  // --- Solis Series ---
  {
    id: 'solis_5015',
    brand: 'Solis',
    model: '5015 E',
    variant: '4WD',
    hp: 50,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'solis_4215',
    brand: 'Solis',
    model: '4215 E',
    variant: '4WD',
    hp: 43,
    image: 'https://images.unsplash.com/photo-1560706834-192629732152?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'solis_4515',
    brand: 'Solis',
    model: '4515 E',
    variant: '2WD',
    hp: 48,
    image: 'https://images.unsplash.com/photo-1530267981375-2734035bd5f5?q=80&w=600&auto=format&fit=crop'
  },

  // --- Yanmar Series ---
  {
    id: 'yanmar_ym357',
    brand: 'Yanmar',
    model: 'YM357A',
    variant: 'Premium',
    hp: 57,
    image: 'https://images.unsplash.com/photo-1592912388091-a20c74da05df?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'yanmar_ym348',
    brand: 'Yanmar',
    model: 'YM348A',
    variant: '4WD',
    hp: 48,
    image: 'https://images.unsplash.com/photo-1589923188900-85dae5233271?q=80&w=600&auto=format&fit=crop'
  },

  // --- Eicher Series ---
  {
    id: 'eicher_380',
    brand: 'Eicher',
    model: '380 Super DI',
    variant: '2WD',
    hp: 40,
    image: 'https://images.unsplash.com/photo-1560706834-192629732152?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'eicher_485',
    brand: 'Eicher',
    model: '485 Super DI',
    variant: '2WD',
    hp: 45,
    image: 'https://images.unsplash.com/photo-1592912388091-a20c74da05df?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'eicher_557',
    brand: 'Eicher',
    model: '557',
    variant: '4WD',
    hp: 50,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'eicher_242',
    brand: 'Eicher',
    model: '242',
    variant: '2WD',
    hp: 25,
    image: 'https://images.unsplash.com/photo-1517643509493-9c8f61555a6d?q=80&w=600&auto=format&fit=crop'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'System Admin',
    mobile: '9999999999',
    role: UserRole.ADMIN,
    district: 'Satara'
  },
  {
    id: 'cust1',
    name: 'Rajesh Patil',
    mobile: '9876543210',
    role: UserRole.CUSTOMER,
    district: 'Satara'
  },
  {
    id: 'deal1',
    name: 'Amit Deshmukh',
    mobile: '8888888888',
    role: UserRole.DEALER,
    district: 'Satara',
    showroomName: 'Deshmukh Tractors',
    brands: ['Mahindra', 'Swaraj'],
    isApproved: true
  },
  {
    id: 'deal2',
    name: 'Suresh Auto',
    mobile: '7777777777',
    role: UserRole.DEALER,
    district: 'Satara',
    showroomName: 'Suresh John Deere',
    brands: ['John Deere', 'Kubota'],
    isApproved: true
  },
  {
    id: 'deal3',
    name: 'Vikas Sales and Trading',
    mobile: '9881484441',
    role: UserRole.DEALER,
    district: 'Satara',
    showroomName: 'Vikas Sales and Trading',
    brands: ['Solis', 'Yanmar', 'Farmtrac'],
    isApproved: true
  },
  {
    id: 'deal4',
    name: 'New Holland Hub',
    mobile: '9000000001',
    role: UserRole.DEALER,
    district: 'Satara',
    showroomName: 'Sai Earthmovers',
    brands: ['New Holland', 'Cooper'],
    isApproved: true
  }
];