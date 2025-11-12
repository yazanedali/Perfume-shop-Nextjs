import { Role } from "@prisma/client";

export interface ICategory {

    id: string;
    name: string;

}

export interface IProduct {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    quantity: number;
    categoryId: string;
    brandId: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
}

export interface IBrand {
    name: string;
    logoUrl: string;
    ownerId: string;
}
export interface OwnerBrand {
    id: string;
    name: string;

}

export interface MobileNavItemProps {
    href: string;
    text: string;
    onClick: () => void;
}


export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  href: string;
  isActive: boolean;
  order: number;
}

export interface IPrimumAccount {
    storeName: String
    description: String
    phone: Number
    officialEmail: String
    address: String
}

export interface ISellerRequest {
    id: string;
    name: string;             // اسم المتجر
    description: string | null;
    phone: number | null;
    address: string | null;
    status: RequestStatus;
    createdAt: Date;
    userId: string;
    user: IUserWithRequests;
}
export interface IUserWithRequests {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
}

export interface Seller {
    name: string;
    email: string;
    productLimit: number;
    brandOwners: Array<{
        brand: {
            products: Array<any>;
        };
    }>;
    sellerRequests: Array<{
        logoUrl?: string | null; // أضف null هنا
    }>;
}

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";


export interface BrandData {
  sellerName: string;
  sellerEmail: string;
  productLimit: number;
  brandCount: number;
  productCount: number;
  ownerLogo: string | null;
  companyName: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  createdAt: Date;
  userId: string;
  requestStatus?: RequestStatus | null;
}

export interface LimitPopupState {
  open: boolean;
  sellerEmail?: string;
  sellerName?: string;
  oldValue?: number;
  newValue?: number;
}

export interface DetailPopupState {
  open: boolean;
  seller?: BrandData;
}