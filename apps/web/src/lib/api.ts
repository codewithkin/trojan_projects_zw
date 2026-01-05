import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { env } from "@trojan_projects_zw/env/web";

/**
 * Axios instance configured for authenticated requests.
 * Uses credentials: "include" to send cookies with requests.
 */
const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // This is equivalent to credentials: "include" in fetch
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Makes an authenticated GET request.
 *
 * @param url - The endpoint URL (relative to base URL)
 * @param config - Optional Axios request configuration
 * @returns Promise with the response data
 *
 * @example
 * ```typescript
 * const projects = await get<Project[]>("/api/projects");
 * ```
 */
export async function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
}

/**
 * Makes an authenticated POST request.
 *
 * @param url - The endpoint URL (relative to base URL)
 * @param data - The request body
 * @param config - Optional Axios request configuration
 * @returns Promise with the response data
 *
 * @example
 * ```typescript
 * const newProject = await post<Project>("/api/projects", { title: "New Project" });
 * ```
 */
export async function post<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
}

/**
 * Makes an authenticated PUT request.
 *
 * @param url - The endpoint URL (relative to base URL)
 * @param data - The request body
 * @param config - Optional Axios request configuration
 * @returns Promise with the response data
 *
 * @example
 * ```typescript
 * const updatedProject = await put<Project>("/api/projects/123", { title: "Updated" });
 * ```
 */
export async function put<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
}

/**
 * Makes an authenticated PATCH request.
 *
 * @param url - The endpoint URL (relative to base URL)
 * @param data - The request body
 * @param config - Optional Axios request configuration
 * @returns Promise with the response data
 *
 * @example
 * ```typescript
 * const patchedProject = await patch<Project>("/api/projects/123", { status: "underway" });
 * ```
 */
export async function patch<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.patch(url, data, config);
  return response.data;
}

/**
 * Makes an authenticated DELETE request.
 *
 * @param url - The endpoint URL (relative to base URL)
 * @param config - Optional Axios request configuration
 * @returns Promise with the response data
 *
 * @example
 * ```typescript
 * await del("/api/projects/123");
 * ```
 */
export async function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.delete(url, config);
  return response.data;
}

/**
 * The configured Axios instance for direct use if needed.
 * Includes withCredentials for automatic cookie handling.
 */
export { api };

/**
 * Generic authenticated request function.
 * Use this when you need more control over the request method.
 *
 * @param config - Full Axios request configuration
 * @returns Promise with the response data
 *
 * @example
 * ```typescript
 * const data = await authenticatedRequest<Project>({
 *   method: "POST",
 *   url: "/api/projects",
 *   data: { title: "New Project" }
 * });
 * ```
 */
export async function authenticatedRequest<T = unknown>(
  config: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.request(config);
  return response.data;
}
