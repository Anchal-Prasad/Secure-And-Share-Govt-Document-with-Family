// 1️⃣ Define DocumentCategory first
export type DocumentCategory =
  | 'education'
  | 'identity'
  | 'financial'
  | 'health'
  | 'property'
  | 'employment'
  | 'other';

// 2️⃣ User interface
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  phone?: string;
  avatar?: string;
}

// 3️⃣ AuthState interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 4️⃣ Document interface using DocumentCategory
export interface Document {
  id: string;
  userId: string;
  name: string;
  category: DocumentCategory; 
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  shared: boolean;
  description?: string;
  filePath?: string;       // Supabase Storage path
  publicUrl?: string;      // ✅ Add this so TS knows about it
}
