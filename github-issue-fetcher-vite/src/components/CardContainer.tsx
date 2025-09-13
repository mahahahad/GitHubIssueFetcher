import React from 'react';
import IssueCard from './IssueCard';
import { Issue } from '../types/github';

interface CardContainerProps {
    issues: Issue[];
}

const CardContainer: React.FC<CardContainerProps> = ({ issues }) => {
    return (
        <div>
            {issues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
            ))}
        </div>
    );
};

export default CardContainer;