import _ from 'lodash';
import React, {ReactElement} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';
import HTML from 'react-native-render-html';

import {isIOS} from '../../../../helpers/device';
import {Colors, Fonts} from '../../../../styles';
import Icon from '../../../icon';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from '../row';
import styles from './styles';

const tagsStyles = {
    p: {
        marginHorizontal: 0,
        marginVertical: 5,
    },
    rawtext: {
        marginHorizontal: 0,
        marginVertical: 5,
    },
    a: {
        color: Colors.white,
        fontFamily: isIOS ? Fonts.bold : Fonts.regular,
    },
};

const baseFontStyle = {
    fontFamily: Fonts.regular,
    color: Colors.white,
    fontSize: isIOS ? 12 : 14,
};

type AccountNoticeItem = AccountBlockItem<
    AccountKind.notice,
    {
        Title: string;
        Message: string;
        DateInfo: string;
    }
>;
type AccountNoticeProps = {
    customStyles?: {
        container?: StyleProp<ViewStyle>;
    };
    displayIcon?: boolean;
    displayDateInfo: boolean;
};

class AccountNotice<P> extends AccountDetailsRow<AccountNoticeItem & P, AccountNoticeProps> {
    static defaultProps = {
        renderSeparator: true,
        customStyles: {},
        displayIcon: true,
        displayDateInfo: true,
    };

    get title(): string {
        const {item} = this.props;

        return item.Val.Title;
    }

    get titleColor(): string {
        return this.baseColor;
    }

    get baseColor(): string {
        const colors = this.themeColors;

        return colors.red;
    }

    get messageIcon(): string {
        return `square-error`;
    }

    onLinkPress = (_, href: string): void => {
        this.navigate(href);
    };

    renderIcon = (): ReactElement => {
        const size = isIOS ? 13 : 20;

        return (
            <Icon
                name={this.messageIcon}
                color={this.baseColor}
                size={size}
                style={[{width: size, height: size}, isIOS && {backgroundColor: Colors.white}]}
            />
        );
    };

    render(): ReactElement {
        const {item, customStyles, displayIcon, displayDateInfo} = this.props;

        return (
            <View style={[styles.container, isIOS && styles.hasBorder, customStyles?.container, this.isDark && styles.borderDark]}>
                {_.isString(this.title) && (
                    <View style={styles.row}>
                        {displayIcon && <View style={styles.icon}>{this.renderIcon()}</View>}
                        <View style={styles.titleContainer}>
                            <Text style={[styles.title, {color: this.titleColor}]}>{this.title}</Text>
                        </View>
                    </View>
                )}
                <View style={styles.row}>
                    <HTML
                        tagsStyles={tagsStyles}
                        defaultTextProps={{
                            selectable: false,
                        }}
                        source={{html: item.Val.Message}}
                        containerStyle={[styles.message, {backgroundColor: this.baseColor}]}
                        onLinkPress={this.onLinkPress}
                        baseFontStyle={baseFontStyle}
                    />
                </View>
                {displayDateInfo && !_.isEmpty(item.Val.DateInfo) && (
                    <View style={[styles.row, styles.rowDateInfo]}>
                        <View style={[styles.icon]}>
                            <Icon name='last-time-date' color={this.selectColor(Colors.grayDark, Colors.white)} size={24} />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.title, styles.dateInfo, this.isDark && styles.textDark]}>{item.Val.DateInfo}</Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export {AccountNotice};
