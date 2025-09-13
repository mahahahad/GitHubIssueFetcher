// filepath: github-issue-fetcher-vite/src/types/github.ts
export interface User {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

export interface Issue {
    id: number;
    title: string;
    body: string;
    user: User;
    state: 'open' | 'closed';
    created_at: string;
    updated_at: string;
    html_url: string;
}