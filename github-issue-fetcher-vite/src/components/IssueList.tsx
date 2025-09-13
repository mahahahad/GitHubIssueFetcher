import React from 'react';
import { Issue } from '../types/github';
import IssueCard from './IssueCard';

interface IssueListProps {
    issues: Issue[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => {
    return (
        <div>
            {issues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
            ))}
        </div>
    );
};

export default IssueList;