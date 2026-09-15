import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// jsdom (the test DOM environment) doesn't implement these Web APIs, even
// though every real browser does. @anthropic-ai/sdk needs them at import
// time, so polyfill from Node's util module for tests only.
if (typeof global.TextEncoder === 'undefined') {
  (global as any).TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = TextDecoder;
}

// jsdom doesn't implement scrollIntoView either, even though it exists on
// every real browser's Element prototype.
if (typeof window !== 'undefined' && !window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
