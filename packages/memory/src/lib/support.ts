import type { BackendKind, Capabilities } from './capabilities.js';
import { UnsupportedError } from './errors.js';

type BooleanCapability = {
  [K in keyof Capabilities]: Capabilities[K] extends boolean ? K : never;
}[keyof Capabilities];

/** Throws `UnsupportedError` when the backend lacks a capability. */
export function assertSupported(
  capabilities: Capabilities,
  key: BooleanCapability,
  operation: string,
  kind: BackendKind,
) {
  if (!capabilities[key]) throw new UnsupportedError(operation, kind);
}
