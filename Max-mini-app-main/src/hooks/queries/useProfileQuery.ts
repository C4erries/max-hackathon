import { useQuery } from "@tanstack/react-query";
import { getUserProfile, type UserProfile } from "@/api/users";
import { queryKeys } from "./keys";

/**
 * Хук для получения данных профиля пользователя
 */
export function useProfileQuery() {
  return useQuery<UserProfile, Error>({
    queryKey: queryKeys.profile.all,
    queryFn: () => {
      console.log("🔄 [useProfileQuery] Выполнение запроса профиля");
      return getUserProfile();
    },
    staleTime: 0, // Данные всегда считаются устаревшими, чтобы всегда обновляться
    gcTime: 0, // Не кэшируем данные (ранее cacheTime)
    refetchOnMount: "always", // Всегда обновляем данные при монтировании компонента
    refetchOnWindowFocus: true, // Обновляем данные при фокусе на окне
  });
}

