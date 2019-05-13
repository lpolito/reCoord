import React from 'react';

export const useLazyInit = (value) => {
    const valueRef = React.useRef(null);

    if (valueRef.current === null) {
        valueRef.current = typeof value === 'function' ? value() : value;
    }

    return valueRef.current;
};
