import { Button } from "@/components/shared/Button";
import { useDocumentFlowPage } from "./hooks/useDocumentFlowPage";
import type { UserRole } from "@/components/shared/BottomNavigation/BottomNavigation";
import myRequestsIcon from "@/assets/icons/doc-success-check.svg";
import approvalIcon from "@/assets/icons/doc-search-two.svg";
import s from "./DocumentFlowPage.module.css";

export interface DocumentFlowPageProps {
  role?: UserRole;
}

export function DocumentFlowPage({ role = "teacher" }: DocumentFlowPageProps) {
  const {
    handleMyRequestsClick,
    handleApprovalClick,
    isAdmin,
  } = useDocumentFlowPage(role);

  return (
    <div className={s.root}>
      <div className={s.content}>
        <div className={s.titleBadge}>
          <h1 className={s.title}>Документооборот</h1>
        </div>
        <div className={s.buttonsContainer}>
          <Button
            variant="rightLeftIconBlack"
            label="Мои заявки"
            leftIcon={myRequestsIcon}
            onClick={handleMyRequestsClick}
            className={s.button}
          />
          {isAdmin && (
            <Button
              variant="rightLeftIconBlack"
              label="Согласование заявок"
              leftIcon={approvalIcon}
              onClick={handleApprovalClick}
              className={s.button}
            />
          )}
        </div>
      </div>
    </div>
  );
}

