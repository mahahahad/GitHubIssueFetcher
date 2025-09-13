import styles from "@/styles/Card.module.css"
import type { Issue } from "@/types/github";

// Individual cards that will be used for mapping all issues and appended to the card conatiner
function Card({ issue }: { issue: Issue }) {
    return (
        <div className={styles.card}>
            <h1 className={styles.card__title}>{issue.title}</h1>
            <p className={styles.card__body}>{issue.body}</p>
        </div>
    )
}

export default Card;