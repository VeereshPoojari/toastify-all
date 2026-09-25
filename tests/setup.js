import '@testing-library/jest-dom';

// Mock DOM APIs for testing
Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: jest.fn(cb => setTimeout(cb, 0))
});

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }))
});
