export interface Label {
    name: string;
    description?: string;
    color: string;
}

export interface Issue {
    id: number;
    title: string;
    body: string;
    labels: Label[];
    url: string;
    html_url: string;
    repository_url: string;
}

export interface Repo {
    full_name: string,
    description?: string,
    language: string,
    forks: number,
    stargazers_count: number,
    html_url: string
}