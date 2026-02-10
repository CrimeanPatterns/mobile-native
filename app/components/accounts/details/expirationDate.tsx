import _ from 'lodash';
import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import TimeAgo from '../../timeAgo';
import ExpirationStateIcon from '../expirationStateIcon';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

type AccountExpirationDateProps = AccountBlockItem<
    AccountKind.expirationDate,
    {
        ExpirationState: string;
        ExpirationDate: {
            ts: number;
            fmt: string;
        };
        formLink?: string;
    }
>;

class AccountExpirationDate extends AccountDetailsRow<AccountExpirationDateProps> {
    get accessibilityLabel(): string {
        const {
            item: {Name, Val},
        } = this.props;
        const {ExpirationDate} = Val;

        return `${Name} ${ExpirationDate.fmt}`;
    }

    renderRightColumn(): ReactElement {
        const {
            item: {Val},
        } = this.props;
        const {ExpirationState, ExpirationDate} = Val;

        return (
            <View style={styles.row}>
                <View style={styles.flexEnd}>
                    {!_.isNil(ExpirationDate.ts) && (
                        <TimeAgo date={ExpirationDate.ts * 1000} style={[styles.text, styles.textBold, this.isDark && styles.textDark]} />
                    )}
                    <Text style={[styles.text, styles.textSmall, this.isDark && styles.textDark]}>{ExpirationDate.fmt}</Text>
                </View>
                <ExpirationStateIcon state={ExpirationState} style={styles.marginLeft} />
                {isIOS && this.isTouchable && this.renderArrow()}
            </View>
        );
    }
}

export default AccountExpirationDate;
