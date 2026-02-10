import 'intl';
import 'intl/dist/Intl.complete';

import _ from 'lodash';

import {deviceLocale} from '../helpers/device';
import Translator from './translator';

// addLocaleData(allLocaleData);

/* eslint-disable no-underscore-dangle */
const languages = {
    _en: require('../assets/languages/en'),
    en: () => languages._en,
    ru() {
        const self = languages.ru;

        self.cached = self.cached || require('../assets/languages/ru');

        return self.cached;
    },
    pt() {
        const self = languages.pt;

        self.cached = self.cached || require('../assets/languages/pt');

        return self.cached;
    },
    es() {
        const self = languages.es;

        self.cached = self.cached || require('../assets/languages/es');

        return self.cached;
    },
    de() {
        const self = languages.de;

        self.cached = self.cached || require('../assets/languages/de');

        return self.cached;
    },
    fr() {
        const self = languages.fr;

        self.cached = self.cached || require('../assets/languages/fr');

        return self.cached;
    },
    zh_TW() {
        const self = languages.zh_TW;

        self.cached = self.cached || require('../assets/languages/zh_TW');

        return self.cached;
    },
    zh_CN() {
        const self = languages.zh_CN;

        self.cached = self.cached || require('../assets/languages/zh_CN');

        return self.cached;
    },
};
/* eslint-enable */

class LocaleManager {
    private readonly fallbackLanguage = 'en';

    private language = this.fallbackLanguage;

    constructor(deviceLocale) {
        const [language] = deviceLocale.split('_');

        this.set(language);
    }

    public set(lang) {
        let language = this.fallbackLanguage;

        if (_.has(languages, lang)) {
            language = lang;
        }
        languages[language]();

        Translator.setLocale(language);
        this.language = language;
    }

    public get() {
        return this.language;
    }
}

const localeManager = new LocaleManager(deviceLocale);

export default localeManager;
export {localeManager as LocaleManger};
