import _ from 'lodash';
import React, {ReactElement} from 'react';
import {Platform, Text, View} from 'react-native';

import {isAndroid, isIOS} from '../../../../helpers/device';
import AccountDetailsRow, {AccountBlockItem} from '../row';
import styles from '../styles';

type AccountMileValueProp = AccountBlockItem<'mileValue', string> & {
    formLink?: string;
};

class AccountMileValue extends AccountDetailsRow<AccountMileValueProp> {
    // eslint-disable-next-line class-methods-use-this
    get isTouchable(): boolean {
        return true;
    }

    get accessibilityLabel(): string {
        const {
            item: {Name, Val},
        } = this.props;

        return `${Name} ${Val}`;
    }

    onPress = (): void => {
        const {
            item: {formLink},
            toggleMileValue,
        } = this.props;

        if (_.isString(formLink)) {
            this.navigate(formLink);
        } else {
            toggleMileValue();
        }
    };

    renderRightColumn(): ReactElement {
        const {
            item: {Val},
        } = this.props;

        return (
            <View style={styles.row}>
                <Text
                    {...Platform.select({
                        android: {
                            // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                            key: Math.random(),
                        },
                    })}
                    style={[
                        styles.text,
                        styles.textBold,
                        this.isDark && styles.textDark,
                        isAndroid && styles.textBlue,
                        isAndroid && this.isDark && styles.textBlueDark,
                    ]}
                    suppressHighlighting
                    selectable>
                    {Val}
                </Text>
                {isIOS && this.renderArrow()}
            </View>
        );
    }
}

export default AccountMileValue;
