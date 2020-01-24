import React from 'react';

export const useOnUpdateEffect = (callback: Function, dependencies: any[]) => {
  const isInitRef = React.useRef(false);

  React.useEffect(() => {
    if (!isInitRef.current) {
      isInitRef.current = true;
      return;
    }

    callback();
  }, dependencies);
};
