import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@trojan_projects_zw/env/web";
import type { 
  Service, 
  ServiceDetail, 
  ServicesResponse, 
  ServiceResponse, 
  ServiceRequest,
  RequestsResponse 
} from "@/types/services";

const API_URL = env.NEXT_PUBLIC_API_URL;

// Fetch all services with optional filters
export function useServices(filters?: { category?: string; featured?: boolean }) {
  return useQuery<Service[]>({
    queryKey: ["services", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters?.featured !== undefined) {
        params.append("featured", String(filters.featured));
      }
      
      const url = `${API_URL}/api/services${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Failed to fetch services");
      }
      
      const data: ServicesResponse = await res.json();
      return data.services;
    },
  });
}

// Fetch a single service by slug
export function useService(slug: string) {
  return useQuery<ServiceDetail>({
    queryKey: ["service", slug],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/services/${slug}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch service");
      }
      
      const data: ServiceResponse = await res.json();
      return data.service;
    },
    enabled: !!slug,
  });
}

// Fetch featured services
export function useFeaturedServices() {
  return useServices({ featured: true });
}

// Toggle like on a service
export function useLikeService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`${API_URL}/api/services/${slug}/like`, {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to like service");
      }
      
      return res.json();
    },
    onSuccess: (_, slug) => {
      // Invalidate both the services list and the individual service
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", slug] });
    },
  });
}

// Request a service
export function useRequestService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ slug, location, notes }: { slug: string; location: string; notes?: string }) => {
      const res = await fetch(`${API_URL}/api/services/${slug}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ location, notes }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to request service");
      }
      
      return res.json();
    },
    onSuccess: (_, { slug }) => {
      // Invalidate the service to update request count
      queryClient.invalidateQueries({ queryKey: ["service", slug] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
    },
  });
}

// Rate a service
export function useRateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ slug, rating, comment }: { slug: string; rating: number; comment?: string }) => {
      const res = await fetch(`${API_URL}/api/services/${slug}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ rating, comment }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to rate service");
      }
      
      return res.json();
    },
    onSuccess: (_, { slug }) => {
      // Invalidate to update ratings
      queryClient.invalidateQueries({ queryKey: ["service", slug] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

// Fetch user's service requests
export function useUserRequests() {
  return useQuery<ServiceRequest[]>({
    queryKey: ["user-requests"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/services/user/requests`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }
      
      const data: RequestsResponse = await res.json();
      return data.requests;
    },
  });
}
