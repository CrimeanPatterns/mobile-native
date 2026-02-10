export const sendClientHeight = `
    window.getClientHeight = function() {
        return document.documentElement.offsetHeight;
    };

    window.sendClientHeight = function() {
        window.ReactNativeWebView.postMessage(window.getClientHeight());
    };

    setTimeout(() => window.sendClientHeight(), 250);
`;
