import { useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useProfileQuery, queryKeys } from "@/hooks/queries";
import { transformProfileForPage } from "../lib/transformProfile";
import { getImageUrlSync } from "@/lib";
import { loginByMaxId } from "@/api/auth";
import { saveToken, saveMaxId } from "@/lib/authStorage";
import { getMaxId } from "@/constants/maxId";
import type { UserRole } from "@/components/shared/BottomNavigation/BottomNavigation";
import type { UserRoleResponse } from "@/api/users";
import avatar from "@/assets/images/event-heart.jpg";

/**
 * Хук для управления логикой страницы профиля
 */
export function useProfilePage(role: UserRole = "student", roleData?: UserRoleResponse | null) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: apiProfile, isLoading, error, refetch } = useProfileQuery();
  
  // Обновляем токен при изменении MAX_ID и инвалидируем кэш
  useEffect(() => {
    const updateTokenAndRefresh = async () => {
      try {
        // Получаем max_id из MAX Bridge или используем значение по умолчанию
        const maxId = getMaxId();
        saveMaxId(maxId);
        const response = await loginByMaxId(maxId);
        saveToken(response.access_token);
        
        console.log(`🔄 [useProfilePage] Токен обновлен для maxId: ${maxId}`);
        
        // Инвалидируем кэш профиля и всех связанных запросов
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
        
        // Обновляем данные профиля
        await refetch();
      } catch (err) {
        console.error("❌ [useProfilePage] Ошибка при обновлении токена:", err);
      }
    };

    // Обновляем токен при изменении roleData
    if (roleData?.user_id) {
      console.log("🔄 [useProfilePage] Обнаружено изменение roleData.user_id:", roleData.user_id);
      updateTokenAndRefresh();
    }
  }, [queryClient, refetch, roleData?.user_id]); // Обновляем при изменении user_id из roleData
  
  // Логируем данные из API для отладки
  if (apiProfile) {
    console.log("📊 [useProfilePage] Данные из API:", apiProfile);
  }
  
  if (roleData) {
    console.log("📊 [useProfilePage] Данные roleData:", roleData);
  }
  
  const profile = apiProfile ? transformProfileForPage(apiProfile) : null;
  
  // Используем данные из roleData, если они доступны, иначе из profile
  const fullName = roleData?.full_name || profile?.fullName || "";
  
  // Логируем преобразованные данные для отладки
  if (profile) {
    console.log("🔄 [useProfilePage] Преобразованные данные:", profile);
  }
  
  const avatarUrl = profile ? getImageUrlSync(profile.avatarUrl) : avatar;

  // Определяем, является ли пользователь преподавателем на основе роли из roleData, profile или пропса
  const isTeacher = useMemo(() => {
    if (role === "teacher") return true;
    // Используем роль из roleData, если доступна
    if (roleData?.role) {
      const roleLower = roleData.role.toLowerCase();
      return roleLower === "staff" || roleLower.includes("преподаватель") || roleLower.includes("teacher");
    }
    // Иначе используем роль из profile
    if (profile?.role) {
      const roleLower = profile.role.toLowerCase();
      return roleLower === "staff" || roleLower.includes("преподаватель") || roleLower.includes("teacher");
    }
    return false;
  }, [role, roleData?.role, profile?.role]);
  
  const isAdmin = useMemo(() => role === "admin", [role]);
  
  // Определяем текст для бейджа роли
  const roleBadgeText = useMemo(() => {
    // Используем роль из roleData, если доступна
    const roleToCheck = roleData?.role || profile?.role;
    if (!roleToCheck) return "";
    const roleLower = roleToCheck.toLowerCase();
    if (roleLower === "staff" || isTeacher) {
      return "Преподаватель";
    }
    return roleToCheck;
  }, [roleData?.role, profile?.role, isTeacher]);

  const handleLibraryClick = useCallback(() => {
    navigate("/library");
  }, [navigate]);

  return {
    profile,
    fullName, // Используем fullName из roleData или profile
    avatarUrl,
    isLoading,
    error,
    handleLibraryClick,
    isTeacher,
    isAdmin,
    roleBadgeText,
  };
}

