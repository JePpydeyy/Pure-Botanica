import { Category } from "./category_interface";
import { Brand } from "./Brand_interface";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  status: string;
  view: number;
  id_brand: string;
  id_category: string;
  images: string[];
  short_description: string;
  description: string;
  option: {
    stock: number;
    value: string;
    price: number;
    discount_price?: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
export interface Comment {
  _id: string;
  user: { username: string };
  content: string;
  createdAt: string;
}