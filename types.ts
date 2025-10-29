
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  status: 'Draft' | 'Published' | 'Archived';
  imageUrl?: string;
  createdAt: string;
}

export type ProductStatus = 'Draft' | 'Published' | 'Archived';

export type View = 'list' | 'detail';

export interface MarketingCopy {
  adHeadline: string;
  adBody: string;
  socialMediaPost: string;
}

export interface ContentAnalysis {
  tone: string;
  clarityScore: number;
  suggestions: string[];
}
