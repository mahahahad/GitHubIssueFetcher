from typing import List
import os

from schema import supabase_client
from get_repo_data import generate_payload, REPO_STAGING_TABLE
from init_sqlite_db import get_db_connection, close_db_connection


def upsert_repo_data(language: str, pages: int, per_page=50, use_sqlite=False, db_path="github_issues.db") -> None:
    """
    Fetches, deduplicates, and upserts GitHub repository data into the staging table.

    Args:
        language (str): The programming language to filter repositories by.
        pages (int): Number of pages of repository results to fetch.
        per_page (int, optional): Number of repositories per page. Defaults to 50.
        use_sqlite (bool, optional): Whether to use SQLite instead of Supabase. Defaults to False.
        db_path (str, optional): Path to SQLite database file. Defaults to "github_issues.db".

    Returns:
        None: Prints summary of operation and logs errors if upsert fails.

    Notes:
        Deduplication is needed because GitHub API may return duplicate repositories across different pages.
        repo_id is used as the unique identifier for deduplication and in the db table.
        Set use_sqlite=True or environment variable DATABASE_TYPE=sqlite to use SQLite instead of Supabase.
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

    # Check if SQLite should be used (parameter or environment variable)
    use_sqlite = use_sqlite or os.getenv("DATABASE_TYPE", "").lower() == "sqlite"

    try:
        if unique_payload:
            if use_sqlite:
                # Use SQLite
                conn = get_db_connection(db_path)
                cursor = conn.cursor()

                for repo in unique_payload:
                    cursor.execute('''
                        INSERT OR REPLACE INTO repo_staging
                        (repo_id, repo_name, repo_url, language, repo_description, repo_owner, open_issues_count)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        repo['repo_id'],
                        repo['repo_name'],
                        repo['repo_url'],
                        repo['language'],
                        repo.get('repo_description'),
                        repo['repo_owner'],
                        repo['open_issues_count']
                    ))

                conn.commit()
                print(f"Successfully upserted {len(unique_payload)} records to SQLite for language: {language}")
                close_db_connection(conn)
            else:
                # Use Supabase (original behavior)
                supabase_client.table(REPO_STAGING_TABLE).upsert(unique_payload).execute()
                print(f"Successfully upserted {len(unique_payload)} records to Supabase for language: {language}")
        else:
            print("No records to upsert after deduplication")
    except Exception as e:
        db_type = "SQLite" if use_sqlite else "Supabase"
        print(f"Error upserting data to {db_type}: {e}")


if __name__ == "__main__":
    """
    Run to populate the database with repo data.

    Database selection:
    - Default: Uses Supabase (original behavior)
    - Set DATABASE_TYPE=sqlite environment variable to use SQLite
    - Or modify use_sqlite parameter in the function calls below

    Examples:
    - Use SQLite: export DATABASE_TYPE=sqlite && python main.py
    - Use Supabase: python main.py (default)
    """

    # Check which database to use
    use_sqlite = os.getenv("DATABASE_TYPE", "").lower() == "sqlite"
    db_type_name = "SQLite" if use_sqlite else "Supabase"
    print(f"Using database: {db_type_name}")

    languages = ["cpp", "javascript", "python", "c"] # Add more languages as needed
    pages = 5 # Number of pages to fetch per language
    per_page = 50 # Number of repos per page

    for lang in languages:
        print(f"Fetching data for language: {lang}")
        upsert_repo_data(language=lang, pages=pages, per_page=per_page, use_sqlite=use_sqlite)
