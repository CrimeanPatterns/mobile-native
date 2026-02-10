import React, {ReactElement} from 'react';
import {Platform, Text} from 'react-native';

import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

type AccountStringProps = AccountBlockItem<AccountKind.string, string>;

const commentStyleColumn = {paddingVertical: 10, alignSelf: 'flex-start'};
const rowStyle = {flexDirection: 'column'};

class AccountString extends AccountDetailsRow<AccountStringProps> {
    get accessibilityLabel(): string {
        const {item} = this.props;

        return `${item.Name} ${item.Val}`;
    }

    get isComment() {
        return this.props.item.Val.length >= 25;
    }

    // @ts-ignore
    get leftColumnStyle() {
        return this.isComment ? commentStyleColumn : styles.leftColumn;
    }

    // @ts-ignore
    get rightColumnStyle() {
        return this.isComment ? commentStyleColumn : styles.rightColumn;
    }

    // @ts-ignore
    get rowStyle() {
        return [styles.itemRow, this.isComment && rowStyle];
    }

    renderRightColumn(): ReactElement {
        const {
            item: {Val},
        } = this.props;

        return (
            <Text
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...Platform.select({
                    android: {
                        // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                        key: Math.random(),
                    },
                })}
                selectable
                style={[styles.text, styles.textBold, this.isDark && styles.textDark]}>
                {Val}
            </Text>
        );
    }
}

export default AccountString;
