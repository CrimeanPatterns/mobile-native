import Translator from 'bazinga-translator';
import {showMessage} from 'react-native-flash-message';

// for translations extract
// eslint-disable-next-line no-unused-vars
export const httpErrors = {
    0: Translator.trans('http-errors.connection', {}, 'mobile'),
    403: Translator.trans('http-errors.denied', {}, 'mobile'),
    404: Translator.trans('http-errors.not-found', {}, 'mobile'),
    500: Translator.trans('http-errors.internal', {}, 'mobile'),
    default: Translator.trans('http-errors.default', {}, 'mobile'),
};

export const httpTranslationErrors = {
    0: 'http-errors.connection',
    403: 'http-errors.denied',
    404: 'http-errors.not-found',
    500: 'http-errors.internal',
    default: 'http-errors.default',
};

export default class GlobalError {
    static show(httpCode) {
        GlobalError.showMessage(GlobalError.getHttpError(httpCode));
    }

    static showMessage(message) {
        showMessage({
            message,
            type: 'danger',
        });
    }

    static getHttpError(httpCode) {
        if (httpTranslationErrors[String(httpCode)]) {
            return Translator.trans(/** @Ignore */ httpTranslationErrors[httpCode], {}, 'mobile');
        }
        return Translator.trans(/** @Ignore */ httpTranslationErrors.default, {}, 'mobile');
    }
}
