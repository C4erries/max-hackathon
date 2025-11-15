import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { App } from "antd";
import { STATUS_CONFIG } from "@/components/widgets/RequestCard/constants";
import {
  useRequestDetailQuery,
  useRequestDocumentsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} from "@/hooks/queries";
import { transformRequestDetailForPage } from "../lib/transformRequestDetail";
import { getDocumentUrl } from "../lib/getDocumentUrl";
import type { RequestDetailPageProps } from "../RequestDetailPage";

/**
 * Хук для управления логикой страницы деталей заявки
 */
export function useRequestDetail({ my = false }: RequestDetailPageProps) {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const requestIdNumber = requestId ? parseInt(requestId, 10) : undefined;
  const { data: apiRequest, isLoading, error } = useRequestDetailQuery(requestIdNumber);
  const { data: documents, isLoading: isLoadingDocuments } = useRequestDocumentsQuery(requestIdNumber);
  const approveMutation = useApproveRequestMutation(requestIdNumber);
  const rejectMutation = useRejectRequestMutation(requestIdNumber);

  const request = apiRequest ? transformRequestDetailForPage(apiRequest) : null;
  const statusConfig = request ? STATUS_CONFIG[request.status] : null;
  const [isActionPerformed, setIsActionPerformed] = useState(false);

  const isStatusFinal =
    request?.status === "approved" ||
    request?.status === "rejected" ||
    request?.status === "ready";
  const isDisabled = isStatusFinal || isActionPerformed || approveMutation.isPending || rejectMutation.isPending;
  const showActions = !my;

  const handleApprove = useCallback(() => {
    if (!request || !requestIdNumber) return;
    
    approveMutation.mutate(
      { comment: "" },
      {
        onSuccess: () => {
          message.success("Заявка успешно одобрена");
          setIsActionPerformed(true);
          // Редирект назад после успешного одобрения
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        },
        onError: (error) => {
          console.error("Ошибка при одобрении заявки:", error);
          message.error("Не удалось одобрить заявку. Пожалуйста, попробуйте позже.");
        },
      }
    );
  }, [request, requestIdNumber, approveMutation, message, navigate]);

  const handleReject = useCallback(() => {
    if (!request || !requestIdNumber) return;
    
    rejectMutation.mutate(
      { reason: "" },
      {
        onSuccess: () => {
          message.success("Заявка успешно отклонена");
          setIsActionPerformed(true);
          // Редирект назад после успешного отклонения
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        },
        onError: (error) => {
          console.error("Ошибка при отклонении заявки:", error);
          message.error("Не удалось отклонить заявку. Пожалуйста, попробуйте позже.");
        },
      }
    );
  }, [request, requestIdNumber, rejectMutation, message, navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleDocumentDownload = useCallback(async (documentUrl: string, filename: string) => {
    try {
      const fullUrl = getDocumentUrl(documentUrl);
      
      // Получаем токен для авторизации
      const token = localStorage.getItem("access_token");
      
      // Загружаем файл с токеном через fetch
      const response = await fetch(fullUrl, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Создаем временную ссылку для скачивания
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Освобождаем память
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании документа:", error);
    }
  }, []);

  // Определяем классы для статуса
  const statusBadgeClassName = useMemo(() => {
    if (!statusConfig) return "";
    const baseClass = "statusBadge";
    if (statusConfig.className === "statusPending") return `${baseClass} statusPending`;
    if (statusConfig.className === "statusApproved") return `${baseClass} statusApproved`;
    if (statusConfig.className === "statusRejected") return `${baseClass} statusRejected`;
    return baseClass;
  }, [statusConfig]);

  const clockWrapperClassName = useMemo(() => {
    if (!statusConfig) return "";
    const baseClass = "clockWrapper";
    if (statusConfig.clockWrapperClassName === "clockWrapperPending") return `${baseClass} clockWrapperPending`;
    if (statusConfig.clockWrapperClassName === "clockWrapperApproved") return `${baseClass} clockWrapperApproved`;
    if (statusConfig.clockWrapperClassName === "clockWrapperRejected") return `${baseClass} clockWrapperRejected`;
    return baseClass;
  }, [statusConfig]);

  const statusIconClassName = useMemo(() => {
    const baseClass = "statusIcon";
    if (request?.status === "rejected") return `${baseClass} statusIconRejected`;
    return baseClass;
  }, [request]);

  return {
    request,
    statusConfig,
    isLoading: isLoading || isLoadingDocuments,
    error,
    isDisabled,
    showActions,
    documents: documents || [],
    statusBadgeClassName,
    clockWrapperClassName,
    statusIconClassName,
    handleApprove,
    handleReject,
    handleBack,
    handleDocumentDownload,
  };
}

