import { Issue } from "@/types/github";

interface CardProps {
    issue: Issue;
}

function Card({ issue }: CardProps) {
    return (
        <div>
            <h3>{issue.title}</h3>
            <p>{issue.body}</p>
            <span>Status: {issue.state}</span>
        </div>
    );
}

export default Card;