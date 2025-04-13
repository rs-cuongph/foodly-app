import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 * Modified version of useEffect
 * Skips initial render, executes the effect only on
 * updates, not during the initial component mount.
 *
 * @param effect
 * @param dependencies
 */

export function useUpdateEffect(
  effect: EffectCallback,
  dependencies?: DependencyList,
) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    return effect();
  }, dependencies);
}
