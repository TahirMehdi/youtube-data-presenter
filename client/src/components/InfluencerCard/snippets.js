import React from 'react';
import {nFormatter} from '../../helpers/mathematical';

export const formattedNumber = number => {
    return (
        <span className="FormattedNumber">
      {nFormatter(number)}
    </span>
    );
};

export function formattedDate (date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    /**
     * Can be defined by application settings.
     * */
    return date.toLocaleString("en-US", options);
}