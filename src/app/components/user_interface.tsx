<<<<<<< HEAD
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
=======
export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  address: {
    addressLine: string;
    ward: string;
    district: string;
    cityOrProvince: string;
  };
  status: string;
  listOrder: any[];
  birthday: string | null;
}


 export interface Option {
  code: number;
  name: string;
>>>>>>> 616c25e57b35873473b038d5a1067ddb45d70c8a
}