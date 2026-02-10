import {ProviderFavicons} from '@assets/favicons';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Image, Text, View} from 'react-native';

import ProviderIcons from '../../../config/providerIcons';
import {isIOS} from '../../../helpers/device';
import {providerFaviconHasBorder} from '../../../helpers/providerFavicon';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import styles, {activeBackgroundColor, activeBackgroundColorDark, rippleColor, rippleColorDark} from './styles';

type ProviderRowProps = {
    name: string;
    added: number;
    code?: string;
    kind?: number;
    onPress: () => void;
};

type IProviderRow = React.FunctionComponent<ProviderRowProps>;

const ProviderRow: IProviderRow = ({name, added, code, kind, onPress}) => {
    const isDark = useDark();
    const logo = ProviderFavicons[code as string];
    const categoriesLogo = ProviderIcons[kind as number];
    const hasBorder = providerFaviconHasBorder(code as string, isDark);

    const renderLogo = () => {
        if (_.isNil(code) && _.isNil(kind)) {
            return null;
        }

        return (
            <View style={styles.providerLogoWrap}>
                {_.isNil(logo) === false ? (
                    <Image
                        style={[styles.providerLogo, hasBorder && styles.providerLogoBorder, isDark && styles.providerLogoDark]}
                        borderRadius={8}
                        source={logo}
                    />
                ) : (
                    <View style={[styles.providerLogo, styles.kindLogo, isDark && styles.providerLogoDark, !isDark && styles.providerLogoBorder]}>
                        <Icon {...categoriesLogo} size={20} color={Colors.grayDark} />
                    </View>
                )}
            </View>
        );
    };

    return (
        <TouchableBackground
            rippleColor={isDark ? rippleColorDark : rippleColor}
            activeBackgroundColor={isDark ? activeBackgroundColorDark : activeBackgroundColor}
            onPress={onPress}>
            <View style={[styles.container, isDark && styles.containerDark]} pointerEvents='box-only'>
                {renderLogo()}
                <View style={styles.containerTitle}>
                    <Text style={[styles.text, isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                        {name}
                    </Text>
                </View>
                {added > 0 && (
                    <View style={styles.containerStatus}>
                        <Text style={[styles.status, isDark && styles.statusDark]} numberOfLines={1}>
                            {Translator.trans('track.program.added', {}, 'messages').toUpperCase()}
                        </Text>
                    </View>
                )}
                {isIOS && <Icon name='arrow' color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={20} />}
            </View>
        </TouchableBackground>
    );
};

export default ProviderRow;
