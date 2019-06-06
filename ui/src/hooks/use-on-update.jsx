import React from 'react';

export const useOnUpdateEffect = (callback, dependencies) => {
    const isInitRef = React.useRef(false);

    React.useEffect(() => {
        if (!isInitRef.current) {
            isInitRef.current = true;
            return;
        }

        callback();
    }, dependencies);
};
