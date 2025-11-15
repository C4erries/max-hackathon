import { useState, useEffect } from "react";

/**
 * Хук для загрузки изображения документа с токеном авторизации
 */
export function useDocumentImage(fileUrl: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        
        // Если URL начинается с /static/, формируем полный URL без /api/v1
        let fullUrl: string;
        if (fileUrl.startsWith("/static/")) {
          const baseUrlWithoutApi = baseUrl.replace(/\/api\/v1$/, "");
          fullUrl = `${baseUrlWithoutApi}${fileUrl}`;
        } else if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
          fullUrl = fileUrl;
        } else {
          fullUrl = `${baseUrl}${fileUrl}`;
        }
        
        // Получаем токен для авторизации
        const token = localStorage.getItem("access_token");
        
        // Загружаем изображение с токеном через fetch
        const response = await fetch(fullUrl, {
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        });
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        
        const blob = await response.blob();
        objectUrl = window.URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Неизвестная ошибка");
        setError(error);
        console.error("Ошибка при загрузке изображения:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileUrl]);

  return { imageUrl, isLoading, error };
}

