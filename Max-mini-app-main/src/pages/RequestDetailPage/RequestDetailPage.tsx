import { Spin, Alert } from "antd";
import { Badge } from "@/components/shared/Badge/Badge";
import { Button } from "@/components/shared/Button";
import { useRequestDetail } from "./hooks/useRequestDetail";
import { useDocumentImage } from "./hooks/useDocumentImage";
import chevronLeftIcon from "@/assets/icons/Icon (2).svg";
import documentIcon from "@/assets/icons/document.svg";
import s from "./RequestDetailPage.module.css";

// Компонент для отображения превью изображения с токеном
function DocumentImagePreview({
  fileUrl,
  filename,
  className,
}: {
  fileUrl: string;
  filename: string;
  className: string;
}) {
  const { imageUrl, isLoading } = useDocumentImage(fileUrl);

  if (isLoading) {
    return (
      <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="small" />
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={documentIcon} alt="Ошибка загрузки" style={{ width: "32px", height: "32px" }} />
      </div>
    );
  }

  return <img src={imageUrl} alt={filename} className={className} loading="lazy" />;
}

export interface RequestDetailPageProps {
  my?: boolean;
}

export function RequestDetailPage(props: RequestDetailPageProps) {
  const {
    request,
    statusConfig,
    isLoading,
    error,
    isDisabled,
    showActions,
    documents,
    statusBadgeClassName,
    clockWrapperClassName,
    statusIconClassName,
    handleApprove,
    handleReject,
    handleBack,
    handleDocumentDownload,
  } = useRequestDetail(props);

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

  if (error || !request || !statusConfig) {
    return (
      <div className={s.root}>
        <div className={s.content}>
          <Alert
            message="Ошибка загрузки заявки"
            description="Не удалось загрузить детали заявки. Пожалуйста, попробуйте позже."
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
        <div className={s.cardContainer}>
        <div className={s.header}>
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
            
            <div className={s.requestNumberBadge}>
                Заявка № {request.requestNumber}
            </div>
        </div>

        <div className={s.statusContainer}>
          <div
            className={[
              s.statusBadge,
              statusBadgeClassName.includes("statusPending") && s.statusPending,
              statusBadgeClassName.includes("statusApproved") && s.statusApproved,
              statusBadgeClassName.includes("statusRejected") && s.statusRejected,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {statusConfig.label}
          </div>
          <div
            className={[
              s.clockWrapper,
              clockWrapperClassName.includes("clockWrapperPending") && s.clockWrapperPending,
              clockWrapperClassName.includes("clockWrapperApproved") && s.clockWrapperApproved,
              clockWrapperClassName.includes("clockWrapperRejected") && s.clockWrapperRejected,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <img
              src={statusConfig.icon}
              alt={statusConfig.label}
              className={[
                s.statusIcon,
                statusIconClassName.includes("statusIconRejected") && s.statusIconRejected,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
        </div>

        <div className={s.fieldsContainer}>
          <Badge
            variant="label"
            label="ФИО"
            value={request.fullName}
            className={s.field}
            valueClassName={s.valueNormal}
          />
          <Badge
            variant="label"
            label="Курс, факультет, группа"
            value={[request.course, request.faculty, request.group]
              .filter(Boolean)
              .join(", ") || "Не указано"}
            className={s.field}
            valueClassName={s.valueSemibold}
          />
          <Badge
            variant="label"
            label="Содержание"
            value={request.content}
            className={s.field}
            valueClassName={s.valueArial}
          />
        </div>

        {documents && documents.length > 0 && (
          <div className={s.documentsSection}>
            <div className={s.documentsHeader}>
              <img
                src={documentIcon}
                alt="Документы"
                className={s.documentsIcon}
              />
              <h2 className={s.documentsTitle}>Прикреплённые документ</h2>
            </div>
            <div className={s.documentsList}>
              {documents.map((doc) => {
                const isImage = doc.mime_type?.startsWith("image/");
                const isPdf = doc.mime_type === "application/pdf";

                return (
                  <div
                    key={doc.id}
                    className={s.documentItem}
                    onClick={() => handleDocumentDownload(doc.file_url, doc.filename)}
                  >
                    {isImage ? (
                      <DocumentImagePreview
                        fileUrl={doc.file_url}
                        filename={doc.filename}
                        className={s.documentPreview}
                      />
                    ) : isPdf ? (
                      <div className={s.documentPreviewPdf}>
                        <img
                          src={documentIcon}
                          alt="PDF"
                          className={s.pdfIcon}
                        />
                        <span className={s.pdfLabel}>PDF</span>
                      </div>
                    ) : (
                      <div className={s.documentPreviewGeneric}>
                        <img
                          src={documentIcon}
                          alt="Документ"
                          className={s.documentIcon}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showActions && (
          <div className={s.actionsContainer}>
            <Button
              variant="approve"
              label="Одобрить"
              onClick={handleApprove}
              disabled={isDisabled}
              className={s.actionButton}
            />
            <Button
              variant="reject"
              label="Отклонить"
              onClick={handleReject}
              disabled={isDisabled}
              className={s.actionButton}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

