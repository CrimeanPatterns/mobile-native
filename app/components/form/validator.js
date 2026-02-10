import Translator from 'bazinga-translator';
import _ from 'lodash';

import util from './util';

export default {
    checkRequired(value) {
        if ((_.isBoolean(value) && value === false) || (_.isString(value) && util.isEmpty(_.trim(value))) || _.isNull(value)) {
            return Translator.trans('notblank', {}, 'validators');
        }

        return null;
    },
};
