import { useState, useCallback, useEffect } from "react";
import { env } from "@trojan_projects_zw/env/native";
import type { Service } from "../types/services";

const API_URL = env.EXPO_PUBLIC_API_URL;

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface UsePaginatedServicesResult {
  services: Service[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function usePaginatedServices(filters?: { category?: string; featured?: boolean }) {
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchServices = useCallback(async (page: number, isRefresh = false) => {
    try {
      if (page === 1 && isRefresh) {
        setIsRefreshing(true);
      } else if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = new URLSearchParams();
      if (filters?.category && filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters?.featured !== undefined) {
        params.append("featured", String(filters.featured));
      }
      params.append("page", String(page));
      params.append("limit", "10");
      
      const url = `${API_URL}/api/services?${params.toString()}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error("Failed to fetch services");
      }
      
      const data = await res.json();
      
      if (page === 1) {
        setServices(data.services);
      } else {
        setServices(prev => [...prev, ...data.services]);
      }
      
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [filters?.category, filters?.featured]);

  // Initial load
  useEffect(() => {
    fetchServices(1);
  }, [fetchServices]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && pagination.hasMore) {
      fetchServices(pagination.page + 1);
    }
  }, [fetchServices, isLoadingMore, pagination.hasMore, pagination.page]);

  const refresh = useCallback(() => {
    fetchServices(1, true);
  }, [fetchServices]);

  return {
    services,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMore: pagination.hasMore,
    loadMore,
    refresh,
  };
}
