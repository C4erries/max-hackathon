import { api } from "./httpClient";

// Типы согласно swagger
export interface ApprovalRequest {
  id: number;
  request_type: string;
  status: string;
  created_at: string;
  content: string;
}

export interface RequestDetail {
  id: number;
  request_type: string;
  author_user_id: string;
  status: "pending" | "approved" | "rejected" | "ready";
  content: string;
  rejection_reason: string | null;
  current_approver_id: string | null;
  approval_road_id: string | null;
  created_at: string;
  updated_at: string;
  documents: string[];
  approval_steps: unknown[];
  author_full_name: string;
  current_approver_full_name: string | null;
}

export interface RequestDocument {
  id: string;
  filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

/**
 * Получить заявки, требующие согласования текущего пользователя
 * GET /api/v1/requests/approval
 */
export async function getApprovalRequests(): Promise<ApprovalRequest[]> {
  try {
    const response = await api.get<ApprovalRequest[]>("/requests/approval");
    return response.data;
  } catch (error) {
    console.error("❌ [API] Ошибка при запросе: GET /api/v1/requests/approval");
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

/**
 * Получить все заявки текущего пользователя
 * GET /api/v1/requests/my
 */
export async function getMyRequests(): Promise<ApprovalRequest[]> {
  try {
    const response = await api.get<ApprovalRequest[]>("/requests/my");
    return response.data;
  } catch (error) {
    console.error("❌ [API] Ошибка при запросе: GET /api/v1/requests/my");
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

/**
 * Получить детальную информацию о заявке
 * GET /api/v1/requests/{request_id}
 */
export async function getRequestDetail(requestId: number): Promise<RequestDetail> {
  try {
    const response = await api.get<RequestDetail>(`/requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ [API] Ошибка при запросе: GET /api/v1/requests/${requestId}`);
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

/**
 * Получить документы заявки
 * GET /api/v1/requests/{request_id}/documents
 */
export async function getRequestDocuments(requestId: number): Promise<RequestDocument[]> {
  try {
    const response = await api.get<RequestDocument[]>(`/requests/${requestId}/documents`);
    return response.data;
  } catch (error) {
    console.error(`❌ [API] Ошибка при запросе: GET /api/v1/requests/${requestId}/documents`);
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

export interface ApproveRequestParams {
  comment?: string;
}

export interface RejectRequestParams {
  reason?: string;
}

/**
 * Одобрить заявку
 * POST /api/v1/requests/{request_id}/approve
 */
export async function approveRequest(
  requestId: number,
  params: ApproveRequestParams = {}
): Promise<RequestDetail> {
  try {
    const response = await api.post<RequestDetail>(`/requests/${requestId}/approve`, {
      comment: params.comment || "",
    });
    return response.data;
  } catch (error) {
    console.error(`❌ [API] Ошибка при запросе: POST /api/v1/requests/${requestId}/approve`);
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

/**
 * Отклонить заявку
 * POST /api/v1/requests/{request_id}/reject
 */
export async function rejectRequest(
  requestId: number,
  params: RejectRequestParams = {}
): Promise<RequestDetail> {
  try {
    const response = await api.post<RequestDetail>(`/requests/${requestId}/reject`, {
      reason: params.reason || "",
    });
    return response.data;
  } catch (error) {
    console.error(`❌ [API] Ошибка при запросе: POST /api/v1/requests/${requestId}/reject`);
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

