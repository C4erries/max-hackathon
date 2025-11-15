import { api } from "./httpClient";

export interface UserProfile {
  full_name: string;
  role: string;
  course_faculty_group: string | null;
  place_of_study: string | null;
  student_card: string | null;
  place_of_work: string | null;
  kafedra: string | null;
  tab_number: string | null;
}

/**
 * Получить данные личного кабинета текущего пользователя
 * GET /api/v1/users/profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    console.log("🔄 [getUserProfile] Отправка запроса на /users/profile");
    const response = await api.get<UserProfile>("/users/profile");
    console.log("✅ [getUserProfile] Получены данные из API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [API] Ошибка при запросе: GET /api/v1/users/profile");
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

export interface UserRoleResponse {
  user_id: string;
  role: string;
  full_name: string;
}

/**
 * Получить роль пользователя по его max_id
 * GET /api/v1/users/by-max-id/{max_id}/role
 */
export async function getUserRoleByMaxId(maxId: number): Promise<UserRoleResponse> {
  try {
    const response = await api.get<UserRoleResponse>(`/users/by-max-id/${maxId}/role`);
    return response.data;
  } catch (error) {
    console.error(`❌ [API] Ошибка при запросе: GET /api/v1/users/by-max-id/${maxId}/role`);
    console.error("🔴 Ошибка:", error);
    throw error;
  }
}

