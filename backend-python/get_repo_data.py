import requests
from typing import List

from schema import GitHubRepoStaging

GITHUB_REPO_SEARCH_API = "https://api.github.com/search/repositories"
REPO_STAGING_TABLE = "github_repos_staging"

excluded_keywords = ["curated", "awesome", "list", "interview", "resources"]


def github_repo_search_by_language(
    language: str,
    page: int,
    sort: str = "stars",
    order: str = "desc",
    per_page: int = 100,
):
    """
    Searches GitHub repositories filtered by programming language with additional parameters.

    Args:
        language (str): The programming language to filter repositories by.
        page (int): Page number for paginated results.
        sort (str, optional): The sorting field (e.g., "stars", "forks", "updated"). Defaults to "stars".
        order (str, optional): Sort order, either "asc" or "desc". Defaults to "desc".
        per_page (int, optional): Number of results per page (max 100). Defaults to 100.

    Returns:
        dict | None: A JSON response from GitHub API if successful, otherwise None.

    Notes:
        excluded_keywords are used to filter out "lists" repositories. Can only filter out 5 keywords at a time.
    """

    query_params = f"q=language:{language} is:public archived:false in:name,description {' '.join(f'NOT {kw}' for kw in excluded_keywords)}&sort={sort}&order={order}&page={page}&per_page={per_page}"

    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    try:
        r = requests.get(
            GITHUB_REPO_SEARCH_API, params=query_params, headers=headers, timeout=10
        )
        return r.json()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None


def generate_payload(language: str, pages: int = 1, per_page: int = 100) -> List[dict]:
    """
    Generates a structured payload of GitHub repositories for a given language.

    Args:
        language (str): The programming language to search for.
        pages (int, optional): Number of result pages to fetch. Defaults to 1.
        per_page (int, optional): Number of repositories per page. Defaults to 100.

    Returns:
        List[dict]: A list of dictionaries containing repository metadata, formatted for staging.
    """

    all_repos = []
    for page in range(1, pages + 1):
        results = github_repo_search_by_language(language, page, per_page=per_page)
        try:
            items = results.get("items", [])
        except AttributeError:
            print(f"Invalid response structure: {results}")
            continue
        for item in items:
            r = GitHubRepoStaging(
                repo_id=item["id"],
                repo_name=item["name"],
                repo_url=item["html_url"],
                language=item["language"],
                repo_description=item["description"],
                repo_owner=item["owner"]["login"],
                open_issues_count=item["open_issues_count"],
            )
            all_repos.append(r.model_dump())
    return all_repos
