import Translator from 'bazinga-translator';
import React from 'react';
import HTML from 'react-native-render-html';

import {useDark} from '../../../../../theme';
import styles, {textColors} from '../styles';
import {Val} from './index';

const Account: React.FunctionComponent<Val> = ({accountNumber, provider, owner}) => {
    const isDark = useDark();
    const data = {
        link_on: '',
        link_off: '',
        bold_on: '<b>',
        bold_off: '</b>',
        accountNumber,
        providerName: provider,
        owner,
    };

    return (
        <HTML
            source={{html: Translator.trans('trips.segment.added-from.account', data, 'trips')}}
            containerStyle={styles.flex1}
            baseFontStyle={{...styles.text, color: isDark ? textColors.dark : textColors.light}}
        />
    );
};

export default Account;
