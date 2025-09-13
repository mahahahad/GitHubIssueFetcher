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
    repo_url: string;
}