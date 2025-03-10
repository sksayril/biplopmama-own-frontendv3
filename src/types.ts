export interface User {
  userName: string;
  credits: number;
  token: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
}

export interface PaymentVerificationData {
  userToken: string;
  order_id: string;
  payment_id: string;
}