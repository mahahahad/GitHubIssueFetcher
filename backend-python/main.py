from typing import List

from schema import supabase_client
from get_repo_data import generate_payload, REPO_STAGING_TABLE


def upsert_repo_data(language: str, pages: int, per_page=50) -> None:
    """
    Fetches, deduplicates, and upserts GitHub repository data into the staging table.

    Args:
        language (str): The programming language to filter repositories by.
        pages (int): Number of pages of repository results to fetch.
        per_page (int, optional): Number of repositories per page. Defaults to 50.

    Returns:
        None: Prints summary of operation and logs errors if upsert fails.

    Notes:
        deudplication is needed because GitHub API may return duplicate repositories across different pages.
        repo_id is used as the unique identifier for deduplication and in the db table
    """

    payload = generate_payload(language=language, pages=pages, per_page=per_page)

    # Remove duplicates and track conflicts
    seen_repo_ids = set()
    unique_payload = []

    for record in payload:
        repo_id = record["repo_id"]
        if repo_id in seen_repo_ids:
            print(
                f"Skipping duplicate repo - Name: {record['repo_name']}, Description: {record.get('repo_description', 'N/A')}"
            )
            continue
        seen_repo_ids.add(repo_id)
        unique_payload.append(record)

    print(
        f"Original payload: {len(payload)} records, After deduplication: {len(unique_payload)} records"
    )

    try:
        if unique_payload:
            supabase_client.table(REPO_STAGING_TABLE).upsert(unique_payload).execute()
            print(
                f"Successfully upserted {len(unique_payload)} records for language: {language}"
            )
        else:
            print("No records to upsert after deduplication")
    except Exception as e:
        print(f"Error upserting data: {e}")


if __name__ == "__main__":
    """
    Run to populate the supabase table with repo data
    """
    languages = ["cpp", "javascript", "python", "c"] # Add more languages as needed
    pages = 5 # Number of pages to fetch per language
    per_page = 50 # Number of repos per page 
    for lang in languages:
        print(f"Fetching data for language: {lang}")
        upsert_repo_data(language=lang, pages=pages, per_page=per_page)
