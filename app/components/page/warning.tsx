import Translator from 'bazinga-translator';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark} from '../../theme';
import Icon from '../icon';

type WarningProps = {
    message?: string;
};
type IWarning = React.FunctionComponent<WarningProps>;

const Warning: IWarning = ({message}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <Icon name='warning' style={styles.icon} color={isDark ? DarkColors.orange : Colors.orange} size={24} />
            <Text style={[styles.message, isDark && styles.messageDark]}>
                {message || Translator.trans('award.account.list.search.not-found', {}, 'messages')}
            </Text>
        </View>
    );
};

export default Warning;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    icon: {
        marginLeft: 15,
    },
    message: {
        fontSize: 13,
        marginHorizontal: 25,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    messageDark: {
        color: Colors.grayLight,
    },
});
