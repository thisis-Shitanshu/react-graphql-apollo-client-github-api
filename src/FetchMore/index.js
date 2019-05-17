import React from 'react';

import Loading from '../Loading';
import { ButtonUnobtrusive } from '../Button';

const FetchMore = ({
    loading,
    hasNextPage,
    variables,
    updateQuery,
    fetchMore,
    children
}) => (
    <div className="FetchMore">
        {loading ? (
            <Loading />
        ) : (
            hasNextPage && (
                <ButtonUnobtrusive
                    className="FecthMore-button"
                    onClick={() => fetchMore({ variables, updateQuery })}
                >
                    More {children}
                </ButtonUnobtrusive>
            )
        )}
    </div>
);

export default FetchMore;