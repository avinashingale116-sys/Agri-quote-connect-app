export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DEALER = 'DEALER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  atPost?: string;
  taluka?: string;
  district: string;
  // Dealer specific
  showroomName?: string;
  brands?: string[]; // Brands the dealer sells
  isApproved?: boolean;
}

export interface Tractor {
  id: string;
  brand: string;
  model: string;
  variant: string;
  hp: number;
  image: string;
  youtubeId?: string; // YouTube Video ID for reviews
}

export enum RequestStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export interface Quote {
  id: string;
  requestId: string;
  dealerId: string;
  dealerName: string; // Denormalized for ease
  dealerMobile?: string; // Denormalized for ease and contact
  showroomName: string;
  
  // Price Breakdown
  exShowroomPrice: number;
  rtoCharges: number;
  insurance: number;
  accessories: number;
  
  basePrice: number; // Represents Total On-Road Cost (Pre-discount)
  discount: number;
  finalPrice: number;
  notes: string;
  submittedAt: string;
}

export interface QuotationRequest {
  id: string;
  customerId: string;
  customerName: string;
  tractorId: string;
  tractorSnapshot: Tractor; // Snapshot in case tractor data changes
  district: string;
  status: RequestStatus;
  createdAt: string;
  quotes: Quote[];
}

// For Gemini AI Advisor
export interface AIRecommendation {
  recommendedModel: string;
  reasoning: string;
}