import React, {ReactElement} from 'react';
import {Platform, Text, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

type AccountLoginProps = AccountBlockItem<AccountKind.login, string>;

class AccountLogin extends AccountDetailsRow<AccountLoginProps> {
    // eslint-disable-next-line class-methods-use-this
    get isTouchable(): boolean {
        return !this.props.hasBlock('accountNumber');
    }

    get accessibilityLabel(): string {
        const {item} = this.props;

        return `${item.Name} ${item.Val}`;
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
        const props = {
            style: [styles.text, styles.textBold, this.isDark && styles.textDark],
        };

        if (this.isTouchable && isAndroid) {
            props.style = [...props.style, {color: this.selectColor(Colors.blue, DarkColors.blue)}];
        }

        return (
            <View style={styles.row}>
                <Text
                    {...props}
                    onLongPress={() => {
                        // needed for text selection
                    }}
                    suppressHighlighting
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
                    {...Platform.select({
                        android: {
                            // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                            key: Math.random(),
                        },
                    })}
                    selectable>
                    {Val}
                </Text>
                {this.isTouchable && isIOS && this.renderArrow()}
            </View>
        );
    }
}

export default AccountLogin;
