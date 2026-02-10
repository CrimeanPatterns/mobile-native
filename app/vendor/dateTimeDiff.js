import Translator from 'bazinga-translator';
import DateTimeDiff from 'date-time-diff';

import LocaleManager from '../services/localeManager';

// For translations dump
// eslint-disable-next-line no-unused-vars
const translations = [
    Translator.trans('today'),
    Translator.trans('tomorrow'),
    Translator.trans('yesterday'),
    Translator.trans('days'),
    Translator.trans('months'),
    Translator.trans('years'),
    Translator.trans('hours'),
    Translator.trans('hours.short'),
    Translator.trans('minutes.short'),
    Translator.trans('minutes'),
    Translator.trans('seconds'),
    Translator.trans('relative_date.future'),
    Translator.trans('relative_date.past'),
];

const dateTimeDiff = new DateTimeDiff(Translator, (num, options) => Intl.NumberFormat(LocaleManager.get().split('_')[0], options).format(num));

dateTimeDiff.format = (fromDateTime, toDateTime, options = {}) => {
    const {onlyDate = false, shortFormat = false, addSuffix = false, fromToday = false, duration = true, locale = null} = options;

    // eslint-disable-next-line no-underscore-dangle
    return dateTimeDiff._format(fromDateTime, toDateTime, onlyDate, shortFormat, addSuffix, fromToday, duration, locale);
};

export default dateTimeDiff;
