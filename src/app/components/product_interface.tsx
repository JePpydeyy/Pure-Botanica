import { Category } from "./category_interface";
import { Brand } from "./Brand_interface";

export interface Product {
  _id: string ;
  id_category: Category;
  id_brand: Brand;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  images?: string[];
  status: string;
  view: number;
  option?: {
    stock: number;
    value: string;
    price: number;
    discount_price?: number;
  }[];
  createdAT: string | { $date: string };
}