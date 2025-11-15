import { useEffect, useState } from "react";
import { loginByMaxId } from "@/api/auth";
import { saveToken, saveMaxId } from "@/lib/authStorage";
import { getMaxId } from "@/constants/maxId";
import { initMaxBridge } from "@/lib/maxBridge";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Инициализируем MAX Bridge
        initMaxBridge();

        // Получаем max_id из MAX Bridge или используем значение по умолчанию
        const maxId = getMaxId();

        // Сохраняем max_id
        saveMaxId(maxId);

        // Получаем токен
        const response = await loginByMaxId(maxId);
        saveToken(response.access_token);

        console.log(`✅ [useAuth] Token получен и сохранен для maxId: ${maxId}`);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Ошибка при получении токена");
        console.error("❌ [useAuth] Ошибка при получении токена:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return {
    isLoading,
    error,
  };
}

