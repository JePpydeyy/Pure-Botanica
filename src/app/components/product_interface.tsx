import { Category } from "./category_interface";

export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  category: Category;
  description: string;
  ingredients: string[];
  usage_instructions: string[];
  special: string[];
  stock: number;
  view: number;
  color: string | null;
  createdAt: string;
  status: string;
}