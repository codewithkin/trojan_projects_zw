import { useCallback } from "react";
import { env } from "@trojan_projects_zw/env/native";
import { useData, useMutation } from "./use-data";
import type { 
  Service, 
  ServiceDetail, 
  ServicesResponse, 
  ServiceResponse, 
  ServiceRequest,
  RequestsResponse 
} from "../types/services";

const API_URL = env.EXPO_PUBLIC_API_URL;

// Fetch all services with optional filters
export function useServices(filters?: { category?: string; featured?: boolean }) {
  const fetchServices = useCallback(async (): Promise<Service[]> => {
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
  }, [filters?.category, filters?.featured]);

  return useData(fetchServices);
}

// Fetch a single service by slug
export function useService(slug: string) {
  const fetchService = useCallback(async (): Promise<ServiceDetail> => {
    const res = await fetch(`${API_URL}/api/services/${slug}`);
    
    if (!res.ok) {
      throw new Error("Failed to fetch service");
    }
    
    const data: ServiceResponse = await res.json();
    return data.service;
  }, [slug]);

  return useData(fetchService, { enabled: !!slug });
}

// Fetch featured services
export function useFeaturedServices() {
  return useServices({ featured: true });
}

// Toggle like on a service
export function useLikeService() {
  return useMutation(async (slug: string) => {
    const res = await fetch(`${API_URL}/api/services/${slug}/like`, {
      method: "POST",
      credentials: "include",
    });
    
    if (!res.ok) {
      throw new Error("Failed to like service");
    }
    
    return res.json();
  });
}

// Request a service
export function useRequestService() {
  return useMutation(async ({ slug, location, notes }: { slug: string; location: string; notes?: string }) => {
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
  });
}

// Rate a service
export function useRateService() {
  return useMutation(async ({ slug, rating, comment }: { slug: string; rating: number; comment?: string }) => {
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
  });
}

// Fetch user's service requests
export function useUserRequests() {
  const fetchRequests = useCallback(async (): Promise<ServiceRequest[]> => {
    const res = await fetch(`${API_URL}/api/services/user/requests`, {
      credentials: "include",
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch requests");
    }
    
    const data: RequestsResponse = await res.json();
    return data.requests;
  }, []);

  return useData(fetchRequests);
}
