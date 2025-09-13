import { useState, useEffect } from 'react';
import { fetchIssues } from '../services/githubApi';
import { Issue } from '../types/github';

const useIssues = (owner: string, repo: string) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getIssues = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedIssues = await fetchIssues(owner, repo);
                setIssues(fetchedIssues);
            } catch (err) {
                setError('Failed to fetch issues');
            } finally {
                setLoading(false);
            }
        };

        if (owner && repo) {
            getIssues();
        }
    }, [owner, repo]);

    return { issues, loading, error };
};

export default useIssues;