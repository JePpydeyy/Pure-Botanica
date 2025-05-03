export interface Product {
  id: any;
  category: {
    _id: string;
    name: string;
    createdAt: string;
  };
  ingredients: string[];
  usage_instructions: string[];
  special: string[];
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  description: string;
  images: string[];
  stock: number;
  createdAt?: string;
  created_at?: string;
}