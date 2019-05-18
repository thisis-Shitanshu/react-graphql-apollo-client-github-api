import React from 'react';

import Link from '../../Link';

const IssueItem = ({ issue }) => (
    <div className="IssueList">
        {/** placeholder to add a show/hide comment button later */}

        <div className="IssueItem-content">
            <h3>
                <Link href={issue.url}>
                    {issue.title}
                </Link>
            </h3>

            <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }}>
                {/** placeholder to render a list of comments later */}
            </div>
        </div>
    </div>
);

export default IssueItem;