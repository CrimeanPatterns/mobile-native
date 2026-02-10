import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {getTouchableComponent} from '../../helpers/touchable';
import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import StatusIcon from './statusIcon';

const TouchableRow = getTouchableComponent(TouchableHighlight);

const Touchable = ({onPress, children}) => {
    if (_.isFunction(onPress)) {
        return (
            <TouchableRow delayPressIn={isIOS ? 250 : 0} onPress={onPress}>
                {children}
            </TouchableRow>
        );
    }

    return children;
};

const MailboxRow = React.memo(
    ({email, owner, status, icon, onPress, theme}) => {
        const isDark = theme === 'dark';

        return (
            <Touchable onPress={onPress}>
                <View style={[styles.container, isDark && styles.containerDark]} pointerEvents='box-only'>
                    <View style={styles.row}>
                        {_.isString(icon) && (
                            <View style={styles.containerIcon}>
                                <StatusIcon name={icon} />
                            </View>
                        )}
                        <View style={styles.containerDetails}>
                            <Text style={[styles.containerEmail, isDark && styles.textDark]}>{email}</Text>
                        </View>
                    </View>
                    {isIOS && _.isString(owner) && (
                        <View style={styles.row}>
                            <View style={styles.containerIcon} />
                            <View style={styles.containerDetails}>
                                <Text style={[styles.ownerText, isDark && styles.textDark]}>{owner}</Text>
                            </View>
                        </View>
                    )}
                    <View style={styles.row}>
                        <View style={styles.containerIcon} />
                        <View style={styles.containerDetails}>
                            {_.isString(status) && <Text style={[styles.containerStatus, isDark && styles.textDark]}>{status}</Text>}
                        </View>
                    </View>
                </View>
            </Touchable>
        );
    },
    (prevProps, nextProps) =>
        prevProps.email === nextProps.email &&
        prevProps.owner === nextProps.owner &&
        prevProps.status === nextProps.status &&
        prevProps.icon === nextProps.icon &&
        prevProps.onPress === nextProps.onPress &&
        prevProps.theme === nextProps.theme,
);

MailboxRow.displayName = 'MailboxRow';
MailboxRow.propTypes = {
    email: PropTypes.string.isRequired,
    owner: PropTypes.string,
    status: PropTypes.string,
    icon: PropTypes.string,
    onPress: PropTypes.func,
    theme: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    container: {
        minHeight: 52,
        backgroundColor: Colors.white,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
    containerDark: {
        backgroundColor: DarkColors.bg,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    containerIcon: {
        ...Platform.select({
            ios: {
                width: 25,
                paddingTop: 3,
            },
            android: {
                width: 56,
                paddingLeft: 6,
                paddingTop: 5,
            },
        }),
    },
    containerDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    containerEmail: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: isIOS ? 15 : 16,
    },
    containerStatus: {
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        fontSize: isIOS ? 11 : 13,
    },
    ownerText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: isIOS ? 11 : 13,
    },
});

export default withTheme(MailboxRow);
