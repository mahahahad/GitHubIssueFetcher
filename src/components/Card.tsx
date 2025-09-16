import styles from '@/styles/Card.module.css';
import type { Issue, Repo } from '@/types/github';
import type React from 'react';
import { useEffect, useState } from 'react';

// Individual cards that will be used for mapping all issues and appended to the card conatiner
function Card({
  issue,
  onClick,
}: {
  issue: Issue;
  onClick: (cardData: { repo?: Repo; issue?: Issue }) => void;
}) {
  let color: React.CSSProperties;
  const [repo, setRepo] = useState<Repo>();

  useEffect(() => {
    fetch(issue.repository_url)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((res) => {
        setRepo(res || {});
        // console.log(res);
      })
      .catch((err) => {
        console.error('Error: ', err);
      });
  }, []);

  const handleClick = () => {
    onClick({ repo, issue });
  };

  return (
    repo?.language && (
      <div className={styles.card} onClick={handleClick}>
        <h1 className={styles.card__title}>{issue.title}</h1>
        <p>{repo?.full_name}</p>
        <div className="detailContainer">
          Stars: {repo?.stargazers_count}, Forks: {repo?.forks}
        </div>
        <div className={styles.card__labels}>
          <p className={styles.label}>{repo?.language}</p>
          {issue.labels.map((label, id) => {
            color = {
              color: `#${label.color}`,
            };
            return (
              label.name != 'good first issue' && (
                <p
                  key={id}
                  className={styles.label}
                  title={label.description}
                  style={color}
                >
                  {label.name}
                </p>
              )
            );
          })}
        </div>
        <p className={styles.card__body}>{issue.body}</p>
      </div>
    )
  );
}

export default Card;
