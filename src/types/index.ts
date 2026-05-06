export type UserRole = "CUSTOMER" | "SELLER" | "RIDER" | "ADMIN";

export interface User {
  id: string;
  phone: string;
  name?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type AddressType = "house" | "apartment" | "compound" | "pickup_point";

export type TurnDirection = "right" | "left" | "straight";

export interface TurnInstruction {
  turnNumber: 1 | 2 | 3;
  direction: TurnDirection;
  atLandmark: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  landmark: string;
  instructions?: string;
  neighborhood?: string;
  isDefault: boolean;
  createdAt: string;
  
  // NEW - Edge cases for Kenyan addressing
  addressType?: AddressType;
  apartmentName?: string;
  gateColour?: string;
  floorLevel?: string;
  turnInstructions?: TurnInstruction[];
  leaveAtNeighbour?: boolean;
  neighbourName?: string;
  callBeforeDelivery?: boolean;
  specialNotes?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  category: string;
  stock: number;
  unit: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus = 
  | "PENDING" 
  | "CONFIRMED" 
  | "PREPARING" 
  | "READY" 
  | "PICKED_UP" 
  | "IN_TRANSIT" 
  | "DELIVERED" 
  | "CANCELLED";

export interface Order {
  id: string;
  userId: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  address: Address;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  riderId?: string;
  riderName?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface Seller {
  id: string;
  name: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  deliveryTime: string;
  imageUrl?: string;
  isOpen: boolean;
}

export interface Rider {
  id: string;
  userId: string;
  name: string;
  phone: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  isOnline: boolean;
}