import { useQuery } from "@tanstack/react-query";
import { getRequestDocuments, type RequestDocument } from "@/api/requests";
import { queryKeys } from "./keys";

/**
 * Хук для получения документов заявки
 */
export function useRequestDocumentsQuery(requestId: number | undefined) {
  return useQuery<RequestDocument[], Error>({
    queryKey: requestId ? queryKeys.requestDocuments.list(requestId) : ["requestDocuments", "disabled"],
    queryFn: () => getRequestDocuments(requestId!),
    enabled: !!requestId,
  });
}

