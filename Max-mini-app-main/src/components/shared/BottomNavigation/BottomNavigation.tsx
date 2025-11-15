import { EventsIcon, ApprovalIcon, ProfileIcon, ElectivesIcon } from "./icons";
import { useBottomNavigation } from "./hooks/useBottomNavigation";
import s from "./BottomNavigation.module.css";

export type UserRole = "student" | "teacher" | "admin";

export interface BottomNavigationProps {
  role?: UserRole;
}

export function BottomNavigation({ role = "teacher" }: BottomNavigationProps) {
  const {
    isActive,
    handleNavClick,
    isStudent,
    middlePath,
    middleAriaLabel,
  } = useBottomNavigation(role);

  return (
    <nav className={s.root}>
      <button
        className={`${s.navItem} ${isActive("/events") ? s.navItemActive : ""}`}
        onClick={() => handleNavClick("/events")}
        aria-label="События"
      >
        <EventsIcon isActive={isActive("/events")} />
      </button>

      <button
        className={`${s.navItem} ${
          isActive(middlePath) ? s.navItemActive : ""
        }`}
        onClick={() => handleNavClick(middlePath)}
        aria-label={middleAriaLabel}
      >
        {isStudent ? (
          <ElectivesIcon isActive={isActive("/electives")} />
        ) : (
          <ApprovalIcon isActive={isActive(middlePath)} />
        )}
      </button>

      <button
        className={`${s.navItem} ${isActive("/profile") ? s.navItemActive : ""}`}
        onClick={() => handleNavClick("/profile")}
        aria-label="Профиль"
      >
        <ProfileIcon isActive={isActive("/profile")} />
      </button>
    </nav>
  );
}

