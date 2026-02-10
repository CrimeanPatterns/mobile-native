export default {
    isEmpty(data) {
        const type = typeof data;

        if (type === 'number' || type === 'boolean') {
            return false;
        }

        if (type === 'undefined' || data === null) {
            return true;
        }

        if (typeof data.length !== 'undefined') {
            return data.length === 0;
        }

        return false;
    },

    breakLine(str) {
        const text = String(str).trim();
        const formatText = text.split('.');

        formatText.pop();
        formatText.map((text) => String(text).trim());
        if (formatText.length > 0) {
            return text.length > 0 ? formatText.join('\n') : null;
        }

        return text;
    },
};
