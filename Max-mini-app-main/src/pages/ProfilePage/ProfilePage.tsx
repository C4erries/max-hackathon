import { Spin, Alert } from "antd";
import { Badge } from "@/components/shared/Badge/Badge";
import { Button } from "@/components/shared/Button";
import { useProfilePage } from "./hooks/useProfilePage";
import { useUserRoleData } from "@/lib";
import bookIcon from "@/assets/icons/book.svg";
import type { UserRole } from "@/components/shared/BottomNavigation/BottomNavigation";
import s from "./ProfilePage.module.css";

export interface ProfilePageProps {
  role?: UserRole;
}

export function ProfilePage({ role = "student" }: ProfilePageProps) {
  const { data: roleData } = useUserRoleData();
  
  const {
    profile,
    fullName,
    avatarUrl,
    isLoading,
    error,
    handleLibraryClick,
    isTeacher,
    isAdmin,
    roleBadgeText,
  } = useProfilePage(role, roleData);


  if (isLoading) {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <div className={s.loaderContainer}>
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <Alert
            message="Ошибка загрузки профиля"
            description="Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <div className={s.content}>
        <div className={s.header}>
          <div className={s.avatarContainer}>
            <img
              src={avatarUrl}
              alt="Аватар"
              className={s.avatar}
            />
            <div className={s.onlineDot} />
          </div>
          <div className={s.roleBadge}>
            {roleBadgeText}
          </div>
        </div>

        <div className={s.fieldsContainer}>
          <Badge
            variant="label"
            label="ФИО"
            value={fullName}
            className={s.field}
            valueClassName={s.valueNormal}
          />
          {!isAdmin && (
            <>
              {isTeacher ? (
                <>
                  <Badge
                    variant="label"
                    label="Должность"
                    value={profile.position || "Не указано"}
                    className={s.field}
                    valueClassName={s.valueSemibold}
                  />
                  <Badge
                    variant="label"
                    label="Место работы"
                    value={profile.placeOfWork || "Не указано"}
                    className={s.field}
                    valueClassName={s.valueSemiboldWhite}
                  />
                  <Badge
                    variant="label"
                    label="Таб. номер"
                    value={profile.tabNumber || "Не указано"}
                    className={s.field}
                    valueClassName={s.valueArialBold}
                  />
                </>
              ) : (
                <>
                  <Badge
                    variant="label"
                    label="Курс, факультет, группа"
                    value={[profile.course, profile.faculty, profile.group]
                      .filter(Boolean)
                      .join(", ") || "Не указано"}
                    className={s.field}
                    valueClassName={s.valueSemibold}
                  />
                  <Badge
                    variant="label"
                    label="Место учёбы"
                    value={profile.placeOfStudy}
                    className={s.field}
                    valueClassName={s.valueSemiboldWhite}
                  />
                  <Badge
                    variant="label"
                    label="Номер студ. билета"
                    value={profile.studentId}
                    className={s.field}
                    valueClassName={s.valueArialBold}
                  />
                </>
              )}
            </>
          )}
        </div>

        {!isTeacher && !isAdmin && (
          <div className={s.libraryButtonContainer}>
            <Button
              variant="rightLeftIcon"
              label="Онлайн библиотека"
              leftIcon={bookIcon}
              onClick={handleLibraryClick}
              className={s.libraryButton}
            />
          </div>
        )}
      </div>
    </div>
  );
}

