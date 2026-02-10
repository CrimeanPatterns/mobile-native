import React, {ReactElement} from 'react';
import {Platform, Text, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

type AccountNumberProps = AccountBlockItem<AccountKind.accountNumber, string>;

class AccountNumber extends AccountDetailsRow<AccountNumberProps> {
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
        const {navigation, route} = this.props;

        navigation.navigate('AccountDetailsBarcode', {
            ...route.params,
            type: 'parsed',
        });
    };

    renderRightColumn(): ReactElement {
        const {
            item: {Val},
        } = this.props;

        return (
            <View style={styles.row} pointerEvents='box-none'>
                <Text
                    onLongPress={() => {
                        // needed for text selection
                    }}
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
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

class PreviewAccountNumber extends AccountNumber {
    renderArrow = (): null => null;
}

export default AccountNumber;
export {PreviewAccountNumber};
