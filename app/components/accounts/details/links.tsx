import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';

import AccountLink, {AccountLinkItem} from './link';
import AccountDetailsRow, {AccountBlockItem, AccountDetailsMainProps, AccountKind} from './row';
import styles from './styles';

type AccountLinksProps = AccountBlockItem<AccountKind.links, AccountLinkItem[]>;

class AccountLinks extends AccountDetailsRow<AccountLinksProps> {
    get mainProps(): AccountDetailsMainProps {
        return {
            account: this.props.account,
            hasBlock: this.props.hasBlock,
            index: this.props.index,
            navigation: this.props.navigation,
            theme: this.props.theme,
            toggleMileValue: this.props.toggleMileValue,
        };
    }

    render(): ReactElement {
        const {
            item: {Name, Val},
        } = this.props;

        return (
            <>
                {this.renderTopSeparator()}
                <View style={[styles.linkTitle, this.isDark && styles.linkTitleDark]} accessible accessibilityLabel={this.accessibilityLabel}>
                    <Text style={[styles.text, styles.textLarge, styles.textBlue, this.isDark && styles.textBlueDark]}>{this.renderCaption()}</Text>
                </View>
                {this.renderBottomSeparator()}
                {Val.map((block, index) => (
                    <AccountLink key={`${Name}-${index}`} item={block} {...this.mainProps} />
                ))}
            </>
        );
    }
}

export default AccountLinks;
