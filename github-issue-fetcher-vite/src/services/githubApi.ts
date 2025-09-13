import axios from 'axios';
import { Issue } from '../types/github';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchIssues = async (owner: string, repo: string): Promise<Issue[]> => {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/issues`);
    return response.data;
};

export const fetchIssueDetails = async (issueNumber: number, owner: string, repo: string): Promise<Issue> => {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/issues/${issueNumber}`);
    return response.data;
};