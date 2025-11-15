import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { UserRole } from "../BottomNavigation";

/**
 * Хук для управления логикой нижней навигации
 */
export function useBottomNavigation(role: UserRole = "teacher") {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = useCallback(
    (path: string) => {
      if (path === "/events") {
        // Первая иконка активна для "/" и "/events"
        return (
          location.pathname === "/" ||
          location.pathname === "/events" ||
          location.pathname.startsWith("/events/")
        );
      }
      if (path === "/profile") {
        // Третья иконка активна для "/profile" и "/library"
        return (
          location.pathname === "/profile" ||
          location.pathname === "/library"
        );
      }
      if (path === "/approval") {
        return (
          location.pathname.startsWith("/approval") ||
          location.pathname.startsWith("/requests/") ||
          location.pathname.startsWith("/my-requests/")
        );
      }
      if (path === "/document-flow") {
        return (
          location.pathname.startsWith("/document-flow") ||
          location.pathname.startsWith("/approval") ||
          location.pathname.startsWith("/requests/") ||
          location.pathname === "/my-requests" ||
          location.pathname.startsWith("/my-requests/")
        );
      }
      if (path === "/electives") {
        return location.pathname.startsWith("/electives");
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  const handleNavClick = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const isStudent = useMemo(() => role === "student", [role]);

  const middlePath = useMemo(
    () => (isStudent ? "/electives" : "/document-flow"),
    [isStudent]
  );

  const middleAriaLabel = useMemo(
    () => (isStudent ? "Элективы" : "Документооборот"),
    [isStudent]
  );

  return {
    isActive,
    handleNavClick,
    isStudent,
    middlePath,
    middleAriaLabel,
  };
}

