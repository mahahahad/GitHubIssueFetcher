import os

from pydantic import BaseModel, Field
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url: str = os.environ.get("SUPABASE_PROJECT_URL")
key: str = os.environ.get("SUPABASE_API_KEY")

supabase_client: Client = create_client(url, key)

class GitHubRepoStaging(BaseModel):
    repo_id: int = Field(description="GitHub Unique Repository ID")
    repo_name: str = Field(description="Name of the GitHub Repository")
    repo_url: str = Field(description="URL of the GitHub Repository")
    language: str = Field(description="Primary programming language of the repository")
    repo_description: str | None = Field(description="Description of the GitHub Repository")
    repo_owner: str = Field(description="Owner of the GitHub Repository")
    open_issues_count: int  = Field(description="Number of open issues in the repository")