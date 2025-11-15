import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveRequest, type ApproveRequestParams } from "@/api/requests";
import { queryKeys } from "./keys";

/**
 * Хук для одобрения заявки
 */
export function useApproveRequestMutation(requestId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ApproveRequestParams) => {
      if (!requestId) {
        throw new Error("Request ID is required");
      }
      return approveRequest(requestId, params);
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

