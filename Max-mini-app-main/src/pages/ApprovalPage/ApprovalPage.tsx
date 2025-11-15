import { Spin, Alert, Empty } from "antd";
import { RequestCard } from "@/components/widgets/RequestCard";
import { useApprovalPage } from "./hooks/useApprovalPage";
import { transformRequestForCard } from "./lib/transformRequest";
import chevronLeftIcon from "@/assets/icons/Icon (2).svg";
import s from "./ApprovalPage.module.css";

export type ApprovalPageType = "approval" | "my";

export interface ApprovalPageProps {
  type?: ApprovalPageType;
}

export function ApprovalPage({ type = "approval" }: ApprovalPageProps) {
  const { requests, isLoading, error, title, handleDetailsClick, handleBack } = useApprovalPage(type);

  return (
    <div className={s.root}>
      <button
        className={s.backButton}
        onClick={handleBack}
        aria-label="Назад"
      >
        <img
          src={chevronLeftIcon}
          alt="Назад"
          className={s.backIcon}
        />
      </button>
      <div className={s.header}>
        <h1 className={s.title}>{title}</h1>
      </div>
      <div className={s.requestsList}>
        {isLoading && (
          <div className={s.loaderContainer}>
            <Spin size="large" />
          </div>
        )}
        {error && (
          <Alert
            message="Ошибка загрузки заявок"
            description="Не удалось загрузить заявки. Пожалуйста, попробуйте позже."
            type="error"
            showIcon
            className={s.alert}
          />
        )}
        {!isLoading && !error && (!requests || requests.length === 0) && (
          <Empty
            description="Заявки не найдены"
            className={s.empty}
          />
        )}
        {!isLoading &&
          !error &&
          requests &&
          requests.length > 0 &&
          requests.map((request) => {
            const transformed = transformRequestForCard(request);
            return (
              <RequestCard
                key={request.id}
                requestNumber={transformed.requestNumber}
                date={transformed.date}
                status={transformed.status}
                description={transformed.description}
                onDetailsClick={() => handleDetailsClick(transformed.id)}
              />
            );
          })}
      </div>
    </div>
  );
}

