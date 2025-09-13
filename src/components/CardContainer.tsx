import styles from '@/styles/CardContainer.module.css'

// Card container element which will contain all of the issues in the card format from the Card.tsx file
function    CardContainer() {
    // let response = fetch(`https://api.github.com/search/issues?q=label:good-first-issue+state:open&type=issue&per_page=10`);

    return (
        <div className={styles.cardContainer}>
            <p>Card Container Element</p>
        </div>
    )
}

export default CardContainer;