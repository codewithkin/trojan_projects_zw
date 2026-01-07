// Service types matching the API response
export interface Service {
  id: string;
  slug: string;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  category: "solar" | "cctv" | "electrical" | "water" | "welding";
  specifications: Record<string, unknown>;
  supports: string[];
  brands: string[];
  images: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  likesCount: number;
  requestsCount: number;
  createdAt: string;
  // Optimistic update fields
  userLiked?: boolean;
  likeCount?: number;
}

export interface ServiceDetail extends Service {
  ratings: ServiceRating[];
  likedBy: string[];
}

export interface ServiceRating {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface ServiceRequest {
  id: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  location: string;
  notes: string | null;
  estimatedPrice: number | null;
  finalPrice: number | null;
  technicianName: string | null;
  confirmedDate: string | null;
  completedDate: string | null;
  createdAt: string;
  service: {
    id: string;
    slug: string;
    name: string;
    images: string[];
    category: string;
  };
}

export interface ServicesResponse {
  services: Service[];
}

export interface ServiceResponse {
  service: ServiceDetail;
}

export interface RequestsResponse {
  requests: ServiceRequest[];
}
