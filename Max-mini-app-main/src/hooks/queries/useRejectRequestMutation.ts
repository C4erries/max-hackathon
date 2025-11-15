import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectRequest, type RejectRequestParams } from "@/api/requests";
import { queryKeys } from "./keys";

/**
 * Хук для отклонения заявки
 */
export function useRejectRequestMutation(requestId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RejectRequestParams) => {
      if (!requestId) {
        throw new Error("Request ID is required");
      }
      return rejectRequest(requestId, params);
    },
    onSuccess: () => {
      // Инвалидируем кэш деталей заявки
      if (requestId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.requestDetail.detail(requestId) });
      }
      // Инвалидируем списки заявок
      queryClient.invalidateQueries({ queryKey: queryKeys.approvalRequests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.myRequests.all });
    },
  });
}

