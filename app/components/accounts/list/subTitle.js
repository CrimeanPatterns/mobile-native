import Translator from 'bazinga-translator';
import React from 'react';
import {Dimensions, Text, View} from 'react-native';

import {isIOS, isTablet} from '../../../helpers/device';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import styles from './account/styles';

@withTheme
class AccountListSubTitle extends BaseThemedPureComponent {
    render = () => {
        const {width} = Dimensions.get('window');
        const textStyle = [styles.accountCaptionText, this.isDark && styles.grayText];

        if (isTablet) {
            return (
                <View style={[styles.accountCaption, this.isDark && styles.accountCaptionDark]}>
                    <View style={styles.accountStatus}>
                        <Text style={textStyle} />
                    </View>
                    <View style={styles.accountColumn}>
                        <Text style={textStyle}>{Translator.trans('award.account.list.column.program')}</Text>
                    </View>
                    {!(width > 767 && width < 1024) && (
                        <View style={styles.accountColumnAccount}>
                            <Text style={textStyle}>{Translator.trans('award.account.list.column.account')}</Text>
                        </View>
                    )}
                    <View style={styles.accountColumnStatus}>
                        <Text style={textStyle}>{Translator.trans('award.account.list.column.status')}</Text>
                    </View>
                    {width > 767 && (
                        <View style={styles.accountColumnExpire}>
                            <Text style={textStyle}>{Translator.trans('award.account.list.column.expire')}</Text>
                        </View>
                    )}
                    <View style={styles.accountColumnBalance}>
                        <Text style={textStyle}>{Translator.trans('award.account.list.column.balance')}</Text>
                    </View>
                    {isIOS && <View style={styles.accountMore} />}
                </View>
            );
        }

        return null;
    };
}

export default AccountListSubTitle;
