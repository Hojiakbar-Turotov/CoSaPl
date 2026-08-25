export type UserRole = 'STUDENT' | 'AUTHOR' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  role: UserRole;
  balance: number;
  telegramId?: string;
  telegramUsername?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type WorkCategory = 
  | 'KURS_ISHI' 
  | 'MDI' 
  | 'REFERAT' 
  | 'TAQDIMOT' 
  | 'MUSTAQIL_ISH' 
  | 'MAQOLA';

export type WorkLanguage = 'UZ' | 'RU' | 'EN';
export type WorkStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Work {
  id: string;
  title: string;
  subject: string;
  category: WorkCategory;
  description: string;
  tableOfContents: string[];
  introductionPreview: string;
  pagesCount: number;
  language: WorkLanguage;
  price: number;
  originalFileUrl: string;
  previewFileUrl?: string;
  authorId: string;
  authorName: string;
  status: WorkStatus;
  salesCount: number;
  uniquenessPercent?: number;
  rating: number;
  downloadsCount: number;
  createdAt: string;
}

export type OrderType = 'INDIVIDUAL' | 'BULK';
export type OrderStatus = 
  | 'PENDING' 
  | 'PLANNING' 
  | 'IN_PROGRESS' 
  | 'REVIEW' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface OrderAttachment {
  name: string;
  url: string;
  size?: string;
}

export interface Order {
  id: string;
  orderType: OrderType;
  studentId: string;
  studentName: string;
  studentPhone: string;
  assignedAuthorId?: string;
  assignedAuthorName?: string;
  subject: string;
  topic: string;
  requirements: string;
  deadline: string;
  pageCount?: number;
  language: WorkLanguage;
  attachments: OrderAttachment[];
  freePlanStatus: 'IN_PROGRESS' | 'COMPLETED';
  freePlanCompletedAt?: string;
  preparedPlanText?: string;
  agreedPrice: number;
  status: OrderStatus;
  resultFileUrl?: string;
  createdAt: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  timestamp: string;
}

export interface PlagiarismCheck {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  documentUrl: string;
  fileName: string;
  subject: string;
  topic: string;
  price: number;
  isPaid: boolean;
  status: 'PENDING' | 'CHECKING' | 'COMPLETED';
  uniquenessPercent?: number;
  fullReportPdfUrl?: string;
  certificatePdfUrl?: string;
  certificateCode?: string;
  completedAt?: string;
  createdAt: string;
}

export type TransactionType = 
  | 'DEPOSIT' 
  | 'PURCHASE' 
  | 'PLAGIARISM_PAYMENT' 
  | 'WITHDRAWAL' 
  | 'EARNING';

export type PaymentProvider = 'CLICK' | 'PAYME' | 'MANUAL_RECEIPT' | 'BALANCE';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  provider: PaymentProvider;
  amount: number;
  receiptImageUrl?: string;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}
