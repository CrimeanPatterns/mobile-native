import _ from 'lodash';
import React, {useCallback} from 'react';
import {View} from 'react-native';

import {isIOS} from '../../../../../helpers/device';
import {handleOpenUrlAnyway} from '../../../../../helpers/handleOpenUrl';
import {Colors, DarkColors} from '../../../../../styles';
import {useDark} from '../../../../../theme';
import Icon from '../../../../icon';
import {TouchableBackground} from '../../../../page/touchable/background';
import styles from '../styles';

type SourceBlocks = {
    confNumber: React.FunctionComponent<SourceVal>;
    email: React.FunctionComponent<SourceVal>;
    account: React.FunctionComponent<SourceVal>;
};
const Components: SourceBlocks = {
    confNumber: require('./confNumber').default,
    email: require('./email').default,
    account: require('./account').default,
};

export type SourceVal = {
    type: 'confNumber' | 'email' | 'account';
    confNumber?: string;
    provider?: string;
    email?: string;
    owner?: string;
    accountNumber?: string;
};

type SourceProps = {
    val: SourceVal;
    link?: {
        href: string;
    };
};

const Source: React.FunctionComponent<SourceProps> = ({val, link}) => {
    const isDark = useDark();

    const onPress = useCallback(() => {
        if (_.isString(link?.href)) {
            handleOpenUrlAnyway({url: link?.href});
        }
    }, [link]);

    const renderRow = useCallback(() => {
        const Component = Components[val.type];

        return <Component {...val} />;
    }, [val]);

    if (_.isObject(link)) {
        return (
            <TouchableBackground
                onPress={onPress}
                activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                rippleColor={isDark ? DarkColors.border : Colors.gray}
                style={[styles.container, styles.arrowCompensation, styles.containerSmall, isDark && styles.containerDark]}>
                {renderRow()}
                {isIOS && <Icon name='arrow' color={Colors.grayDarkLight} colorDark={DarkColors.gray} size={24} />}
            </TouchableBackground>
        );
    }

    return <View style={[styles.container, styles.arrowCompensation, styles.containerSmall, isDark && styles.containerDark]}>{renderRow()}</View>;
};

export default Source;
