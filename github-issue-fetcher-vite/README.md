# GitHub Issue Fetcher Vite

This project is a React application built with TypeScript and Vite, designed to fetch and display issues from GitHub repositories. It provides a user-friendly interface for users to input repository details and view the corresponding issues in a structured format.

## Project Structure

The project is organized into several directories and files:

- **src/**: Contains the main application code.
  - **main.tsx**: Entry point of the application.
  - **App.tsx**: Main application component.
  - **types/**: TypeScript interfaces and types related to GitHub issues.
    - **github.ts**: Defines types for issues and users.
  - **services/**: Functions for making API calls to GitHub.
    - **githubApi.ts**: Contains functions like `fetchIssues` and `fetchIssueDetails`.
  - **hooks/**: Custom hooks for managing state and side effects.
    - **useIssues.ts**: Hook for fetching and managing issues state.
  - **components/**: React components for the application.
    - **IssueFetcherForm.tsx**: Form for inputting repository details.
    - **IssueList.tsx**: Displays a list of issues.
    - **IssueCard.tsx**: Represents an individual issue card.
    - **Card.tsx**: Styled card container for individual issues.
    - **CardContainer.tsx**: Container for multiple IssueCard components.
  - **utils/**: Utility functions for data manipulation.
    - **helpers.ts**: Contains helper functions used throughout the application.

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/mahad/github-issue-fetcher-vite.git
cd github-issue-fetcher-vite
npm install
```

## Usage

After installing the dependencies, you can start the development server:

```bash
npm run dev
```

This will start the Vite development server, and you can view the application in your browser at `http://localhost:3000`.

## Features

- Input repository details to fetch issues.
- Display issues in a structured format.
- Modular code structure for easy maintenance and scalability.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.