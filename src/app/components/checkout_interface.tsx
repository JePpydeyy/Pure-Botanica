
export interface Address {
  addressLine: string;
  ward: string;
  district: string;
  cityOrProvince: string;
}

export interface FormData {
  fullName: string;
  address: Address;
  sdt: string;
  note: string;
  paymentMethod: string;
}

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  details?: Record<string, any>;
}

export interface CheckoutData {
  cart: {
    items: CartItem[];
  };
  couponCode?: string;
  subtotal: number;
  discount: number;
  total: number;
  userId?: string;
}