import React, {ReactElement} from 'react';
import {Text} from 'react-native';

import TimeAgo from '../../timeAgo';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

type AccountDateProps = AccountBlockItem<
    AccountKind.date,
    {
        ts: number;
        fmt: string;
    }
>;

class AccountDate extends AccountDetailsRow<AccountDateProps> {
    get accessibilityLabel(): string {
        const {
            item: {Name, Val},
        } = this.props;

        return `${Name} ${Val.fmt}`;
    }

    renderRightColumn(): ReactElement {
        const {
            item: {Val},
        } = this.props;

        return (
            <>
                <TimeAgo date={Val.ts * 1000} style={[styles.text, styles.textBold, this.isDark && styles.textDark]} />
                <Text style={[styles.text, styles.textSmall, this.isDark && styles.textDark]}>{`(${Val.fmt})`}</Text>
            </>
        );
    }
}

export default AccountDate;
