export interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
  }
  
  export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
  }
  
  export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
  }
  