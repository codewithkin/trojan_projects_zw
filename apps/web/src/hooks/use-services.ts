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
    // Optimistic update
    onMutate: async (slug) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["service", slug] });
      await queryClient.cancelQueries({ queryKey: ["services"] });
      
      // Snapshot the previous value
      const previousService = queryClient.getQueryData<ServiceDetail>(["service", slug]);
      const previousServices = queryClient.getQueryData<Service[]>(["services"]);
      
      // Optimistically update the service
      if (previousService) {
        queryClient.setQueryData<ServiceDetail>(["service", slug], {
          ...previousService,
          userLiked: !previousService.userLiked,
          likeCount: previousService.userLiked 
            ? previousService.likeCount - 1 
            : previousService.likeCount + 1,
        });
      }
      
      // Optimistically update services list
      if (previousServices) {
        queryClient.setQueryData<Service[]>(["services"], 
          previousServices.map(service => 
            service.slug === slug 
              ? { 
                  ...service, 
                  userLiked: !service.userLiked,
                  likeCount: service.userLiked ? service.likeCount - 1 : service.likeCount + 1,
                }
              : service
          )
        );
      }
      
      return { previousService, previousServices };
    },
    // Rollback on error
    onError: (err, slug, context) => {
      if (context?.previousService) {
        queryClient.setQueryData(["service", slug], context.previousService);
      }
      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }
    },
    // Always refetch after error or success
    onSettled: (_, __, slug) => {
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
    // Optimistic update
    onMutate: async ({ slug }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["service", slug] });
      await queryClient.cancelQueries({ queryKey: ["services"] });
      
      // Snapshot the previous value
      const previousService = queryClient.getQueryData<ServiceDetail>(["service", slug]);
      const previousServices = queryClient.getQueryData<Service[]>(["services"]);
      
      // Optimistically update the request count
      if (previousService) {
        queryClient.setQueryData<ServiceDetail>(["service", slug], {
          ...previousService,
          requestCount: previousService.requestCount + 1,
        });
      }
      
      // Optimistically update services list
      if (previousServices) {
        queryClient.setQueryData<Service[]>(["services"], 
          previousServices.map(service => 
            service.slug === slug 
              ? { ...service, requestCount: service.requestCount + 1 }
              : service
          )
        );
      }
      
      return { previousService, previousServices };
    },
    // Rollback on error
    onError: (err, { slug }, context) => {
      if (context?.previousService) {
        queryClient.setQueryData(["service", slug], context.previousService);
      }
      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }
    },
    // Always refetch after error or success
    onSettled: (_, __, { slug }) => {
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
