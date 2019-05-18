import React, { Fragment, useState } from 'react';

// Custome files
import FetchMore from '../../FetchMore';
import RepositoryItem from '../RepositoryItem';
import Issues from '../../Issue';

const getUpdateQuery = entry => (
    previousResult, 
    { fetchMoreResult }
) => {
    if(!fetchMoreResult) {
        return previousResult;
    }

    return {
        ...previousResult,
        [entry]: {
            ...previousResult[entry],
            repositories: {
                ...previousResult[entry].repositories,
                ...fetchMoreResult[entry].repositories,
                edges: [
                    ...previousResult[entry].repositories.edges,
                    ...fetchMoreResult[entry].repositories.edges
                ]
            }
        }
    }
};

const RepositoryList = ({ 
    repositories, 
    fetchMore,
    loading,
    entry
}) => {

    const [issueState, setIssueState] = useState('NONE');

    const onChangeIssueState = nextIssueState => {
        setIssueState(nextIssueState);
    };

    return (
        <Fragment>
            {repositories.edges.map(({ node }) => (
                <div 
                    key={node.id} 
                    className="RepositoryItem"
                >
                    <RepositoryItem {...node} />

                    <Issues 
                        repositoryName={node.name}
                        repositoryOwner={node.owner.login}
                        issueState={issueState}
                        onChangeIssueState={onChangeIssueState}
                    />
                </div>
            ))}

            <FetchMore
                loading={loading}
                hasNextPage={repositories.pageInfo.hasNextPage}
                variables={{
                    cursor: repositories.pageInfo.endCursor
                }}
                updateQuery={getUpdateQuery(entry)}
                fetchMore={fetchMore}
            >
                Repository
            </FetchMore>
        </Fragment>
    )
};

export default RepositoryList;