import '@testing-library/jest-dom/vitest';

// Mock window.scrollTo for JSDOM
if (typeof window !== 'undefined') {
  window.scrollTo = () => {};
}
