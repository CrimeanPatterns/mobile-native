export const fs = {
    dirs: {
        DocumentDir: 'DocumentDir/',
        CacheDir: 'CacheDir/',
    },
    readFile: jest.fn((filePath) => `content of ${filePath}`),
    asset: jest.fn((fileName) => `/path/to/${fileName}`),
};
