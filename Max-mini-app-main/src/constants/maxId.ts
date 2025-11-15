import { getMaxUserId } from "@/lib/maxBridge";

/**
 * Получить max_id из MAX Bridge или использовать значение по умолчанию
 * Приоритет: MAX Bridge user.id > значение по умолчанию
 */
export function getMaxId(): number {
  const userId = getMaxUserId();
  
  if (userId !== null) {
    return userId;
  }
  
  // Значение по умолчанию, если MAX Bridge недоступен (для разработки)
  const defaultMaxId = 1;
  console.warn(`⚠️ [getMaxId] MAX Bridge недоступен, используется значение по умолчанию: ${defaultMaxId}`);
  return defaultMaxId;
}

