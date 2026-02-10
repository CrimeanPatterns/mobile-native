import React, {ReactElement} from 'react';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';

import {useDark} from '../../../../theme';
import styles from './styles';

type AccountDisplayNameProps = {
    title: string;
    styles?: {
        container?: StyleProp<ViewStyle>;
        title?: StyleProp<TextStyle>;
        subTitle?: StyleProp<TextStyle>;
    };
};

const AccountDisplayName: React.FunctionComponent<AccountDisplayNameProps> = ({title, styles: customStyles = {}}) => {
    const isDark = useDark();
    // eslint-disable-next-line no-useless-escape
    const regex = /^(.+?)(\((?:[^\)]+)\))?$/;
    const names = regex.exec(title);
    const view: ReactElement[] = [];

    if (names && names.length > 0) {
        view.push(
            <Text style={[styles.title, isDark && styles.titleDark, customStyles.title]} key='displayName'>
                {names[1]}
            </Text>,
        );
        if (names[2]) {
            view.push(
                <Text style={[styles.subTitle, isDark && styles.subTitleDark, customStyles.subTitle]} key='programName'>
                    {names[2]}
                </Text>,
            );
        }
    }

    return (
        <View style={[styles.titleRow, customStyles.container]} accessible accessibilityLabel={title}>
            {view}
        </View>
    );
};

export default AccountDisplayName;
