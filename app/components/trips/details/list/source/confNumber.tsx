import Translator from 'bazinga-translator';
import React from 'react';
import HTML from 'react-native-render-html';

import {useDark} from '../../../../../theme';
import styles, {textColors} from '../styles';
import {Val} from './index';

const ConfNumber: React.FunctionComponent<Val> = ({provider, confNumber}) => {
    const isDark = useDark();
    const data = {
        link_on: '<b>',
        link_off: '</b>',
        bold_on: '<b>',
        bold_off: '</b>',
        providerName: provider,
        confNumber,
    };

    return (
        <HTML
            source={{html: Translator.trans('trips.segment.added-from.conf-number', data, 'trips')}}
            containerStyle={styles.flex1}
            baseFontStyle={{...styles.text, color: isDark ? textColors.dark : textColors.light}}
        />
    );
};

export default ConfNumber;
