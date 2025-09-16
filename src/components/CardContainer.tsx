import styles from '@/styles/CardContainer.module.css';
import Card from './Card';
import { useEffect, useState } from 'react';
import type { Issue, Repo } from '@/types/github';

// Card container element which will contain all of the issues in the card format from the Card.tsx file
function CardContainer({
  onCardClick,
}: {
  onCardClick: (cardData: { repo?: Repo; issue?: Issue }) => void;
}) {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    fetch(
      `https://api.github.com/search/issues?q=label:"good first issue"+state:open&type=issue&per_page=10`
    )
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((data) => {
        setIssues(data.items || []);
      })
      .catch((err) => {
        console.error('Error: ', err);
      });
  }, []);

  return (
    <div className={styles.cardContainer}>
      {issues.map((issue: Issue) => {
        return <Card key={issue.id} issue={issue} onClick={onCardClick}></Card>;
      })}
    </div>
  );
}

export default CardContainer;
