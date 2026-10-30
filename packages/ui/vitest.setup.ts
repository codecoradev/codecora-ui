import '@testing-library/jest-dom/vitest';

// jsdom has no ResizeObserver; bits-ui sliders and floating content use it.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
