import type { Issue, Repo } from '@/types/github';
import IssueCard from './IssueCard';
import styles from '@/styles/DialogOverlay.module.css';

function DialogOverlay({
  open,
  setOpen,
  cardData,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  cardData: { repo?: Repo; issue?: Issue } | undefined;
}) {
  return (
    open && (
      <div className={styles.overlay}>
        <IssueCard setOpen={setOpen} cardData={cardData} />
      </div>
    )
  );
}

export default DialogOverlay;
