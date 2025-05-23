export interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  } | null; // product có thể là null nếu không có sản phẩm
  content: string;
  createdAt: string;
}