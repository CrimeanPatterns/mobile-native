export default {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    get: () => Promise.resolve(null),
}
