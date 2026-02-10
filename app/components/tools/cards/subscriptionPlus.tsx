import {TouchableBackground} from '@components/page/touchable';
import {Canvas, RadialGradient, Rect, vec} from '@shopify/react-native-skia';
import Translator from 'bazinga-translator';
import React, {useMemo} from 'react';
import {Image, ImageSourcePropType, Text, useWindowDimensions, View} from 'react-native';

import {Colors} from '../../../styles';
import {useDark} from '../../../theme';
import styles from './styles';
import Logo from '../../../assets/images/plus-awardwallet-min.svg'

const SubscriptionBonus: React.FC<{source: ImageSourcePropType; name: string}> = ({source, name}) => {
    const isDark = useDark();

    return (
        <View style={styles.bonus}>
            <Image resizeMode='contain' style={styles.subscriptionBonusImage} source={source} />
            <Text style={[styles.text, styles.textSubscriptionBonus, isDark && styles.textDark]}>{name}</Text>
        </View>
    );
};

type SubscriptionPlusProps = {
    onPress: () => void;
};

type ISubscriptionPlus = React.FunctionComponent<SubscriptionPlusProps>;

const SubscriptionPlus: ISubscriptionPlus = ({onPress}) => {
    const {width: windowWidth} = useWindowDimensions();
    const isDark = useDark();

    const Gradient = useMemo(
        () => (
            <Canvas style={styles.gradientWrap}>
                <Rect x={0} y={0} width={1000} height={1000}>
                    <RadialGradient c={vec((windowWidth - 30) / 2, 100)} r={160} colors={['#5481BE', '#5481BE00']} />
                </Rect>
            </Canvas>
        ),
        [windowWidth],
    );

    return (
        <TouchableBackground
            rippleColor={Colors.deepBlue}
            activeBackgroundColor={Colors.deepBlue}
            style={{height: 159, backgroundColor: '#2B5B9E', borderRadius: 8}}
            onPress={onPress}>
            {Gradient}
            <View style={styles.awPlus}>
                <Text style={[styles.text, styles.textPlusMiddle, isDark && styles.textDark]}>
                    {Translator.trans(/** @Desc("Upgrade to") */ 'upgrade-to', {}, 'mobile-native')}
                </Text>
                <Text style={[styles.text, styles.textPlusTitle, isDark && styles.textDark, styles.marginBottom]}>
                    {"AwardWallet Plus"}
                </Text>
                <View style={styles.row}>
                    <View style={styles.marginRight}>
                        <SubscriptionBonus
                            source={require('../../../assets/images/plus-property.png')}
                            name={Translator.trans('subscription.properties.title', {}, 'mobile-native')}
                        />
                        <SubscriptionBonus
                            source={require('../../../assets/images/plus-expire.png')}
                            name={Translator.trans('subscription.expirations.title', {}, 'mobile-native')}
                        />
                    </View>
                    <View>
                        <SubscriptionBonus
                            source={require('../../../assets/images/plus-5x.png')}
                            name={Translator.trans('subscription.update.title', {}, 'mobile-native')}
                        />
                        <SubscriptionBonus
                            source={require('../../../assets/images/plus-flights.png')}
                            name={Translator.trans('subscription.monitoring.title', {}, 'mobile-native')}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.plusLogoWrap}>
                <Logo />
            </View>
        </TouchableBackground>
    );
};

export default SubscriptionPlus;
