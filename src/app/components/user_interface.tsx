interface User {
  _id: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  listOrder: string[];
  birthday: string | null;
  status: string;
  role: string;
  googleId?: string; // Optional, as it appears only in some users
  createdAt: string;
}