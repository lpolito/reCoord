import React from 'react';

export const useLazyInit = <T>(value: T): T => {
  const valueRef = React.useRef(null);

  if (valueRef.current === null) {
    valueRef.current = typeof value === 'function' ? value() : value;
  }

  return valueRef.current!;
};
