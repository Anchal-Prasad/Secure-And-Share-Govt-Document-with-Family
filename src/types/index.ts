export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

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
  filePath?: string; // Add this for Supabase Storage path
}