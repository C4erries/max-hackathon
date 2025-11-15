import { useQuery } from "@tanstack/react-query";
import { getUserRoleByMaxId, type UserRoleResponse } from "@/api/users";
import { queryKeys } from "./keys";

/**
 * Хук для получения роли пользователя по max_id
 */
export function useUserRoleQuery(maxId: number | undefined) {
  return useQuery<UserRoleResponse, Error>({
    queryKey: maxId ? queryKeys.userRole.detail(maxId) : ["userRole", "disabled"],
    queryFn: () => getUserRoleByMaxId(maxId!),
    enabled: !!maxId,
  });
}

