import React from 'react';
import {Platform} from 'react-native';
import BaseHTML from 'react-native-render-html';

import {handleOpenUrlAnyway} from '../helpers/handleOpenUrl';
import {Colors, Fonts} from '../styles';
import {withTheme} from '../theme';
import {BaseThemedPureComponent} from './baseThemed';

const fontStyles = {
    fontFamily: Fonts.regular,
    ...Platform.select({
        ios: {
            fontSize: 12,
        },
        android: {
            fontSize: 14,
        },
    }),
};

@withTheme
class Html extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        ...BaseHTML.propTypes,
    };

    static defaultProps = {
        ...BaseHTML.defaultProps,
    };

    onLinkPress(event, href) {
        handleOpenUrlAnyway({url: href});
    }

    render() {
        const {tagsStyles = {}, baseFontStyle, textSelectable = false, onLinkPress = this.onLinkPress, html, ...rest} = this.props;
        const colors = this.themeColors;
        const color = this.selectColor(Colors.grayDark, Colors.white);

        return (
            <BaseHTML
                {...rest}
                defaultTextProps={{
                    selectable: textSelectable,
                }}
                source={{html}}
                tagsStyles={{
                    a: {
                        ...Platform.select({
                            ios: {
                                fontWeight: 'bold',
                            },
                            android: {
                                fontWeight: '500',
                            },
                        }),
                        ...fontStyles,
                        ...baseFontStyle,
                        color: colors.blue,
                        textDecorationLine: 'none',
                        ...tagsStyles.a,
                    },
                    span: {
                        color,
                        ...fontStyles,
                        ...baseFontStyle,
                    },
                    p: {
                        color,
                        ...fontStyles,
                        ...baseFontStyle,
                    },
                    ...tagsStyles,
                }}
                classesStyles={{
                    bold: {
                        fontWeight: 'bold',
                    },
                }}
                baseFontStyle={{
                    color,
                    ...fontStyles,
                    ...baseFontStyle,
                }}
                onLinkPress={onLinkPress}
            />
        );
    }
}

export default Html;
