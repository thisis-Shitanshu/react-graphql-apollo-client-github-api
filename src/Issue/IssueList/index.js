import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';

const GET_ISSUES_OF_REPOSITORY = gql`
    query($repositoryOwner: String!, $repositoryName: String!) {
        repository(name: $repositoryName, owner: $repositoryOwner) {
            issues(first: 5) {
                edges {
                    node {
                        id
                        number
                        state
                        title
                        url
                        bodyHTML
                    }
                }
            }
        }
    }
`;

const ISSUE_STATES = {
    NONE: 'NONE',
    OPEN: 'OPEN',
    CLOSED: 'CLOSED'
};

const TRANSITION_LABELS = {
    [ISSUE_STATES.NONE]: 'Show Open Issues',
    [ISSUE_STATES.OPEN]: 'Show Closed Issues',
    [ISSUE_STATES.CLOSED]: 'Hide Issues'
};

const TRANSITION_STATE = {
    [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
    [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
    [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE
};

const isShow = issueState => issueState !== ISSUE_STATES.NONE;

const Issues = ({ repositoryOwner, repositoryName }) => {
    
    const [issueState, setIssueState] = useState(ISSUE_STATES.NONE);

    const onChangeIssueState = nextIssueState => {
        setIssueState(nextIssueState);
    };
    
    return(
        <div className="Issues">
            <ButtonUnobtrusive
                onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
            >
                {TRANSITION_LABELS[issueState]}
            </ButtonUnobtrusive>

            {isShow(issueState) && (
                <Query
                    query={GET_ISSUES_OF_REPOSITORY}
                    variables={{
                        repositoryOwner,
                        repositoryName
                    }}
                >
                {({ data, loading, error }) => {
                    if (error) {
                        return <ErrorMessage error={error}/>
                    }

                    const { repository } = data;

                    if (loading && !repository) {
                        return <Loading />
                    }

                    const filteredRepository = {
                        issues: {
                            edges: repository.issues.edges.filter(
                                issue => issue.node.state === issueState
                            )
                        }
                    };

                    if(!filteredRepository.issues.edges.length) {
                        return <div className="IssueList">No issues...</div>
                    }

                    return <IssueList issues={filteredRepository.issues} />
                }}
            </Query>
            )}
        </div>
    );
};

const IssueList = ({ issues }) => (
    <div className="IssueList">
        {issues.edges.map(({ node }) => (
            <IssueItem key={node.id} issue={node}/>
        ))}
    </div>
);

export default Issues;