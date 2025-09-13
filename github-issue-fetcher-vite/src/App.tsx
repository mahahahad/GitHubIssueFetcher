import React from 'react';
import IssueFetcherForm from './components/IssueFetcherForm';
import IssueList from './components/IssueList';
import { useIssues } from './hooks/useIssues';

const App: React.FC = () => {
    const { issues, fetchIssues } = useIssues();

    return (
        <div>
            <IssueFetcherForm onFetch={fetchIssues} />
            <IssueList issues={issues} />
        </div>
    );
};

export default App;