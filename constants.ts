
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

export const BRAND_LOGOS: Record<string, string> = {
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

export const BRAND_HERO_IMAGES: Record<string, string> = {
  'Mahindra': 'https://images.unsplash.com/photo-1605218427306-0335808b871d?q=80&w=1000&auto=format&fit=crop',
  'John Deere': 'https://images.unsplash.com/photo-1560706834-192629732152?q=80&w=1000&auto=format&fit=crop',
  'Sonalika': 'https://images.unsplash.com/photo-1592912388091-a20c74da05df?q=80&w=1000&auto=format&fit=crop',
  'Kubota': 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=1000&auto=format&fit=crop',
  'New Holland': 'https://images.unsplash.com/photo-1530267981375-2734035bd5f5?q=80&w=1000&auto=format&fit=crop',
  'Swaraj': 'https://images.unsplash.com/photo-1589923188900-85dae5233271?q=80&w=1000&auto=format&fit=crop'
};

export const MOCK_TRACTORS: Tractor[] = [
  { id: 'mah_jivo_225', brand: 'Mahindra', model: 'JIVO 225 DI', variant: '4WD', hp: 20, image: 'https://images.unsplash.com/photo-1605218427306-0335808b871d?q=80&w=600&auto=format&fit=crop', youtubeId: 'Sg_J1_2Wv_8' },
  { id: 't2', brand: 'Mahindra', model: 'JIVO 245 DI', variant: '4WD', hp: 24, image: 'https://images.unsplash.com/photo-1517643509493-9c8f61555a6d?q=80&w=600&auto=format&fit=crop', youtubeId: 'qQJvJ5x1i2c' },
  { id: 't1', brand: 'Mahindra', model: '575 DI XP Plus', variant: '2WD', hp: 47, image: 'https://images.unsplash.com/photo-1530267981375-2734035bd5f5?q=80&w=600&auto=format&fit=crop', youtubeId: '9p8q7r6s5t4' },
  { id: 't4', brand: 'Swaraj', model: '744 FE', variant: '2WD', hp: 48, image: 'https://images.unsplash.com/photo-1562657520-05e94b2a4778?q=80&w=600&auto=format&fit=crop', youtubeId: 'g6h7i8j9k0l' },
  { id: 't3', brand: 'John Deere', model: '5310', variant: 'Trem IV', hp: 55, image: 'https://picsum.photos/400/300?random=3', youtubeId: 'y1z2a3b4c5d' },
  { id: 'kub_mu4501', brand: 'Kubota', model: 'MU4501', variant: '2WD', hp: 45, image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=600&auto=format&fit=crop' },
  { id: 'nh_3630_tx', brand: 'New Holland', model: '3630 TX Super Plus', variant: '2WD', hp: 50, image: 'https://images.unsplash.com/photo-1592912388091-a20c74da05df?q=80&w=600&auto=format&fit=crop' },
  { id: 'solis_5015', brand: 'Solis', model: '5015 E', variant: '4WD', hp: 50, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop' }
];

export const MOCK_USERS: User[] = [
  { id: 'admin1', name: 'System Admin', mobile: '9999999999', role: UserRole.ADMIN, district: 'Satara' },
  { id: 'cust_requested', name: 'Satish Yadav', mobile: '8600503794', role: UserRole.CUSTOMER, district: 'Satara', atPost: 'Arvi', taluka: 'Koregaon' },
  { id: 'cust1', name: 'Rajesh Patil', mobile: '9876543210', role: UserRole.CUSTOMER, district: 'Satara' },
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
  }
];
