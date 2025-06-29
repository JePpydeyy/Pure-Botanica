import { Product } from "./product_interface";
 export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  optionId?: string; // ID của option (e.g., "685d42c26c8527c2fb69d3a5")
  optionValue?: string; // Giá trị của option (e.g., "100ml")
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
}