import BazingaTranslator from 'bazinga-translator';

const Translator = {
    ...BazingaTranslator,
    /**
     * Translates the given message.
     *
     * @param {String} id               The message id
     * @param {Object} [parameters]     An array of parameters for the message
     * @param {String} [domain]         The domain for the message or null to guess it
     * @param {String} [locale]         The locale or null to use the default
     * @return {String}                 The translated string
     * @api public
     */
    trans(id, parameters, domain = this.defaultDomain, locale) {
        return BazingaTranslator.trans(id, parameters, domain, locale);
    },

    /**
     * Translates the given choice message by choosing a translation according to a number.
     *
     * @param {String} id               The message id
     * @param {Number} number           The number to use to find the indice of the message
     * @param {Object} [parameters]     An array of parameters for the message
     * @param {String} [domain]         The domain for the message or null to guess it
     * @param {String} [locale]         The locale or null to use the default
     * @return {String}                 The translated string
     * @api public
     */
    transChoice(id, number, parameters, domain = this.defaultDomain, locale) {
        return BazingaTranslator.transChoice(id, number, parameters, domain, locale);
    },

    setLocale(locale) {
        BazingaTranslator.locale = locale;
    },

    get locale() {
        return BazingaTranslator.locale;
    },
};

export default Translator;
