/** A failed call: a non-2xx answer, an unreachable server, or an unsupported operation. */
export class MemoryError extends Error {
  readonly status: number;
  readonly code: 'http' | 'network' | 'unsupported' | 'invalid';

  constructor(message: string, code: MemoryError['code'], status = 0) {
    super(message);
    this.name = 'MemoryError';
    this.code = code;
    this.status = status;
  }
}

export class UnsupportedError extends MemoryError {
  constructor(operation: string, backend: string) {
    super(`${operation} is not supported by ${backend}`, 'unsupported');
    this.name = 'UnsupportedError';
  }
}
