import sqlite3
import os
from pathlib import Path


def init_sqlite_db(db_path: str = "github_issues.db") -> sqlite3.Connection:
    """
    Initialize a SQLite database with tables for storing GitHub repository and issue data.

    Args:
        db_path (str): Path to the SQLite database file. Defaults to "github_issues.db".

    Returns:
        sqlite3.Connection: Connection object to the initialized database.
    """

    # Create the database directory if it doesn't exist
    db_file = Path(db_path)
    db_file.parent.mkdir(parents=True, exist_ok=True)

    # Connect to SQLite database (creates file if it doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create repositories staging table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS repo_staging (
            repo_id INTEGER PRIMARY KEY,
            repo_name TEXT NOT NULL,
            repo_url TEXT NOT NULL,
            language TEXT NOT NULL,
            repo_description TEXT,
            repo_owner TEXT NOT NULL,
            open_issues_count INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create issues table for storing GitHub issues
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS issues (
            issue_id INTEGER PRIMARY KEY,
            repo_id INTEGER NOT NULL,
            issue_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            body TEXT,
            state TEXT NOT NULL,
            created_at_github TIMESTAMP,
            updated_at_github TIMESTAMP,
            closed_at_github TIMESTAMP,
            labels TEXT,  -- JSON string of labels
            assignees TEXT,  -- JSON string of assignees
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (repo_id) REFERENCES repo_staging (repo_id),
            UNIQUE(repo_id, issue_number)
        )
    ''')

    # Create index for better query performance
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_repo_language
        ON repo_staging(language)
    ''')

    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_issues_repo_id
        ON issues(repo_id)
    ''')

    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_issues_state
        ON issues(state)
    ''')

    # Create trigger to update updated_at timestamp
    cursor.execute('''
        CREATE TRIGGER IF NOT EXISTS update_repo_staging_timestamp
        AFTER UPDATE ON repo_staging
        BEGIN
            UPDATE repo_staging SET updated_at = CURRENT_TIMESTAMP WHERE repo_id = NEW.repo_id;
        END
    ''')

    cursor.execute('''
        CREATE TRIGGER IF NOT EXISTS update_issues_timestamp
        AFTER UPDATE ON issues
        BEGIN
            UPDATE issues SET updated_at = CURRENT_TIMESTAMP WHERE issue_id = NEW.issue_id;
        END
    ''')

    # Commit the changes
    conn.commit()

    print(f"SQLite database initialized successfully at: {os.path.abspath(db_path)}")
    print("Tables created:")
    print("  - repo_staging: For storing GitHub repository data")
    print("  - issues: For storing GitHub issues data")
    print("Indexes and triggers created for optimal performance")

    return conn


def get_db_connection(db_path: str = "github_issues.db") -> sqlite3.Connection:
    """
    Get a connection to the SQLite database.

    Args:
        db_path (str): Path to the SQLite database file.

    Returns:
        sqlite3.Connection: Connection object to the database.
    """
    if not os.path.exists(db_path):
        print(f"Database {db_path} doesn't exist. Initializing...")
        return init_sqlite_db(db_path)

    return sqlite3.connect(db_path)


def close_db_connection(conn: sqlite3.Connection) -> None:
    """
    Close the database connection.

    Args:
        conn (sqlite3.Connection): The database connection to close.
    """
    if conn:
        conn.close()
        print("Database connection closed.")


if __name__ == "__main__":
    # Initialize the database when run directly
    connection = init_sqlite_db()

    # Test the connection by querying the tables
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    print("\nCreated tables:")
    for table in tables:
        print(f"  - {table[0]}")

    # Close the connection
    close_db_connection(connection)
