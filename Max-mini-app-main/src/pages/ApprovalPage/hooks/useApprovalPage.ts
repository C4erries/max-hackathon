import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApprovalRequestsQuery, useMyRequestsQuery } from "@/hooks/queries";
import type { ApprovalPageType } from "../ApprovalPage";

/**
 * Хук для управления логикой страницы согласования/моих заявок
 */
export function useApprovalPage(type: ApprovalPageType = "approval") {
  const navigate = useNavigate();
  const isMyRequests = type === "my";

  const {
    data: approvalRequests,
    isLoading: isLoadingApproval,
    error: errorApproval,
  } = useApprovalRequestsQuery({
    enabled: !isMyRequests,
  });

  const {
    data: myRequests,
    isLoading: isLoadingMy,
    error: errorMy,
  } = useMyRequestsQuery({
    enabled: isMyRequests,
  });

  const requests = isMyRequests ? myRequests : approvalRequests;
  const isLoading = isMyRequests ? isLoadingMy : isLoadingApproval;
  const error = isMyRequests ? errorMy : errorApproval;
  const title = isMyRequests ? "Мои заявки" : "Согласование";

  const handleDetailsClick = useCallback(
    (requestId: string) => {
      if (isMyRequests) {
        navigate(`/my-requests/${requestId}`);
      } else {
        navigate(`/requests/${requestId}`);
      }
    },
    [isMyRequests, navigate]
  );

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    requests,
    isLoading,
    error,
    title,
    handleDetailsClick,
    handleBack,
  };
}

