export interface SubCategory {
  _id: string;
  name: string;
  category: string;
}

export interface Product {
  id: any;
  category: string;
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
  sub_category?: SubCategory; // Thêm sub_category
}