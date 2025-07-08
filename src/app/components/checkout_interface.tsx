import { Cart } from "./cart_interface";

export interface Address {
  addressLine: string;
  ward: string;
  district: string;
  cityOrProvince: string;
}

// Interface cho dữ liệu form
 export interface FormData {

  fullName: string;
  addressLine: string;
  ward: string;
  district: string;
  cityOrProvince: string;
  sdt: string;
  note: string;
  paymentMethod: "bank" | "cod";
}
// Interface cho dữ liệu thanh toán
 export interface CheckoutData {
  cart: Cart;
  couponCode?: string;
  subtotal: number;
  discount: number;
  total: number;
  userId: string;
}