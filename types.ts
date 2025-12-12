export enum Platform {
  YOUTUBE = 'YOUTUBE',
  INSTAGRAM = 'INSTAGRAM',
  NAVER = 'NAVER',
  DANGGEUN = 'DANGGEUN'
}

export interface InputField {
  key: string; // 'url', 'url2', 'content', etc.
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  pricePerUnit: number;
  minQuantity: number;
  description: string;
  platform: Platform;
  inputs?: InputField[]; // Optional custom inputs. If missing, defaults to standard URL input.
}

export interface OrderFormState {
  platform: Platform;
  serviceId: string;
  url: string;
  quantity: number;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  content: string;
  platform: Platform;
  date: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}