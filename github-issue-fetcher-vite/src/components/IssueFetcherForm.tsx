import React, { useState } from 'react';
import { useIssues } from '../hooks/useIssues';

const IssueFetcherForm: React.FC = () => {
    const [owner, setOwner] = useState('');
    const [repo, setRepo] = useState('');
    const { fetchIssues } = useIssues();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchIssues(owner, repo);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Repository Owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Repository Name"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                required
            />
            <button type="submit">Fetch Issues</button>
        </form>
    );
};

export default IssueFetcherForm;