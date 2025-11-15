import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/components/shared/BottomNavigation/BottomNavigation";

/**
 * Хук для управления логикой страницы документооборота
 */
export function useDocumentFlowPage(role: UserRole = "teacher") {
  const navigate = useNavigate();

  const isAdmin = useMemo(() => role === "admin", [role]);

  const handleMyRequestsClick = useCallback(() => {
    navigate("/my-requests");
  }, [navigate]);

  const handleApprovalClick = useCallback(() => {
    navigate("/approval");
  }, [navigate]);

  const handleVacationClick = useCallback(() => {
    // Заглушка
    console.log("Отпуск - заглушка");
  }, []);

  return {
    handleMyRequestsClick,
    handleApprovalClick,
    handleVacationClick,
    isAdmin,
  };
}

