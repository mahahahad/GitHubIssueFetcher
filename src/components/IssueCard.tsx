import type { Issue, Repo } from '@/types/github';
import styles from '@/styles/IssueCard.module.css';
import Markdown from 'react-markdown';

function IssueCard({
  setOpen,
  cardData,
}: {
  setOpen: (val: boolean) => void;
  cardData: { repo?: Repo; issue?: Issue } | undefined;
}) {
  return (
    <div className={styles.card}>
      <h1 className={styles.card__title}>{cardData?.issue?.title}</h1>
      <div className={styles.card__bodyContainer}>
        <div className={styles.card__body}>
          <Markdown>{cardData?.issue?.body}</Markdown>
        </div>
      </div>
      <div className={styles.card__buttonContainer}>
        <button
          onClick={() => {
            window.open(cardData?.issue?.html_url, 'blank');
          }}
        >
          Visit
        </button>
        <button
          onClick={() => {
            setOpen(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default IssueCard;
