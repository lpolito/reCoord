import React from 'react';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
export const useInterval = (callback: Function, delay: number | null) => {
    const savedCallback = React.useRef<Function>(() => {});

    // Remember the latest callback.
    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    // eslint-disable-next-line consistent-return
    React.useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
