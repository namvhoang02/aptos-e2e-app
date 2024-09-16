import Debug from 'debug';
import * as React from 'react';

const debug = Debug('hooks:useDidUpdateEffect');

export function useDidUpdateEffect(fn: () => void, inputs: any) {
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    if (didMountRef.current) {
      debug('run use did update effect');
      fn();
    }
    didMountRef.current = true;
  }, inputs);
}
