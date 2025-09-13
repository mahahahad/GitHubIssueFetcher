import React from 'react';
import { Issue } from '../types/github';

interface IssueCardProps {
    issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    return (
        <div>
            <h3>{issue.title}</h3>
            <p>{issue.body}</p>
            <p>Status: {issue.state}</p>
            <p>Created by: {issue.user.login}</p>
        </div>
    );
};

export default IssueCard;