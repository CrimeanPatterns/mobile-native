import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';

import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

export type EliteStatusProps = AccountBlockItem<
    AccountKind.eliteStatus,
    {
        eliteStatusName: string;
        nextEliteLevel?: string;
    }
>;

class EliteStatus extends AccountDetailsRow<EliteStatusProps> {
    renderLeftColumn(): ReactElement {
        const {
            item: {
                Name,
                Val: {nextEliteLevel},
            },
        } = this.props;

        return (
            <>
                <Text style={[styles.text, this.isDark && styles.textDark]}>{Name}</Text>
                {_.isString(nextEliteLevel) && (
                    <Text style={[styles.text, styles.textSmall, this.isDark && styles.textDark]}>
                        {Translator.trans('account.details.elitelevels.next-elite-level', {}, 'messages')}
                    </Text>
                )}
            </>
        );
    }

    renderRightColumn(): ReactElement {
        const {
            item: {
                Val: {eliteStatusName, nextEliteLevel},
            },
        } = this.props;

        return (
            <View style={styles.flexEnd}>
                <Text style={[styles.text, styles.textBold, this.isDark && styles.textDark]}>{eliteStatusName}</Text>
                {_.isString(nextEliteLevel) && <Text style={[styles.text, styles.textSmall, this.isDark && styles.textDark]}>{nextEliteLevel}</Text>}
            </View>
        );
    }
}

export default EliteStatus;
