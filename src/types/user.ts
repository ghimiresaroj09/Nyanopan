export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  addresses: Address[];
  defaultAddressId: string | null;
}

export interface StoredUser extends User {
  passwordSalt: string;
  passwordHash: string;
}

export interface Session {
  userId: string;
  name: string;
  email: string;
}

export interface OrderLine {
  slug: string;
  name: string;
  colorName: string;
  size: number;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  cityOrDistrict: string;
  address: string;
  landmark?: string;
  companyName?: string;
  panVatNumber?: string;
  orderNote?: string;
}

export interface Order {
  id: string;
  number: number;
  userId: string;
  email: string;
  placedAt: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
  status: "Confirmed";
}

export interface OrderDraft {
  userId: string;
  email: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
}
