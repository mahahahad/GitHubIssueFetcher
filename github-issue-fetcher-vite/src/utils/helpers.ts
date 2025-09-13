// src/utils/helpers.ts
export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const truncateString = (str: string, maxLength: number): string => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

export const isValidRepo = (owner: string, repo: string): boolean => {
    return owner.trim() !== '' && repo.trim() !== '';
};