import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {handleOpenUrlAnyway} from '../helpers/handleOpenUrl';
import {Colors, Fonts} from '../styles';
import {withTheme} from '../theme';
import {BaseThemedPureComponent} from './baseThemed';
import HTML from './html';
import Icon from './icon';

const fontSize = Platform.select({ios: 13, android: 12});

const baseFontStyle = {
    fontFamily: Fonts.regular,
    fontSize,
    lineHeight: 16,
    color: Colors.white,
};

@withTheme
class WarningMessage extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        text: PropTypes.string.isRequired,
        iconColor: PropTypes.string,
        containerStyle: PropTypes.object,
        fontStyle: PropTypes.object,
        linkStyle: PropTypes.object,
        onLinkPress: PropTypes.func,
    };

    static defaultProps = {
        iconColor: Colors.white,
    };

    onLinkPress = (event, href) => {
        const {onLinkPress} = this.props;

        if (_.isFunction(onLinkPress)) {
            onLinkPress(event, href);
        } else {
            handleOpenUrlAnyway({url: href});
        }
    };

    render() {
        const {iconColor, containerStyle, fontStyle, linkStyle, text, ...props} = this.props;
        const colors = this.themeColors;
        const fontStyles = {
            ...baseFontStyle,
            ...fontStyle,
        };

        return (
            <View style={[styles.container, {backgroundColor: colors.orange}, containerStyle]}>
                <Icon name='warning' color={iconColor} size={14} />
                <View style={styles.textWrap}>
                    <HTML
                        {...props}
                        tagsStyles={{
                            p: {
                                fontSize,
                            },
                            a: {
                                ...fontStyles,
                                ...linkStyle,
                                ...Platform.select({
                                    ios: {
                                        fontWeight: 'bold',
                                    },
                                    android: {
                                        fontWeight: '500',
                                    },
                                }),
                                textDecorationLine: 'none',
                            },
                            span: {
                                fontSize,
                            },
                        }}
                        baseFontStyle={fontStyles}
                        textSelectable={false}
                        html={text}
                        onLinkPress={this.onLinkPress}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    textWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 20,
    },
});

export default WarningMessage;
