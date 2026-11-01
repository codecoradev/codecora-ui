/**
 * The key that pairs with a letter for shortcuts on this device: ⌘ on Apple
 * platforms, Ctrl elsewhere. Starts as Ctrl so prerendered pages stay stable,
 * and corrects itself once the page runs. Call it during component setup.
 */
export function createModKey() {
  let key = $state('Ctrl');
  $effect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) key = '⌘';
  });
  return {
    get value() {
      return key;
    },
  };
}
