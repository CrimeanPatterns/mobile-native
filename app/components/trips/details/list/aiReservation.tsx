import Icon from '@components/icon';
import {TouchableOpacity} from '@components/page/touchable';
import {RouteProp, useRoute} from '@react-navigation/native';
import TimelineService from '@services/timeline';
import {Colors, DarkColors} from '@styles/index';
import Translator from 'bazinga-translator';
import fromColor from 'color';
import _ from 'lodash';
import React, {useState} from 'react';
import {Image, View} from 'react-native';
import HTML from 'react-native-render-html';

import {isIOS} from '../../../../helpers/device';
import {useColorTheme, useDark} from '../../../../theme';
import {TripStackParamList} from '../../../../types/navigation';
import styles from './styles';

const AiReservation = ({confirmDelete, canChange, deleted}) => {
    const isDark = useDark();
    const selectColor = useColorTheme();
    const route = useRoute<RouteProp<TripStackParamList, 'TimelineSegmentDetails'>>();
    const [showAiWarning, setShowAiWarning] = useState(true);

    const handlePress = () => {
        const reload = route.params?.reload;

        TimelineService.hideAiWarning(route.params?.id);
        setShowAiWarning(false);

        if (_.isFunction(reload)) {
            setTimeout(reload, 250);
        }
    };

    const getContentText = () => {
        const properties = {href_on: '<a href="javascript: void(0)">', href_off: '</a>'};

        if (canChange && !deleted) {
            return Translator.trans(
                /** @Desc("This reservation was processed using AI. Please check the details below for accuracy. If there's a problem, please %href_on%remove this reservation%href_off% from your timeline.") */ 'ai-reservation.warning',
                properties,
                'mobile-native',
            );
        }

        return Translator.trans(
            /** @Desc("This reservation was processed using AI. Please check the details below for accuracy.") */ 'ai-reservation.warning-without-permission',
            {},
            'mobile-native',
        );
    };

    const renderAiBanner = () => {
        const html = `<p>${getContentText()}</p>`;

        return (
            <HTML
                tagsStyles={{
                    a: {
                        textDecorationLine: isDark ? 'underline' : 'none',
                        color: isIOS ? selectColor(Colors.blue, Colors.white) : selectColor(Colors.blue, DarkColors.text),
                    },
                    p: {
                        marginVertical: 0,
                    },
                }}
                baseFontStyle={{...styles.text, ...styles.textSmall, ...(isDark && styles.textDark)}}
                defaultTextProps={{
                    selectable: false,
                }}
                onLinkPress={confirmDelete}
                source={{html}}
            />
        );
    };

    return (
        <>
            {showAiWarning && (
                <View style={[styles.container, isDark && styles.containerWarningDark]}>
                    <View style={[styles.warningWrap, isDark && styles.warningWrapDark]}>
                        <View style={[styles.marginIcon, !isIOS && styles.aiIconWrap]}>
                            <Image source={require('@assets/images/ai_icon.png')} />
                        </View>
                        <View style={styles.flex1}>{renderAiBanner()}</View>
                        <TouchableOpacity onPress={handlePress} style={styles.rightButtonWrap}>
                            <Icon
                                name={'error'}
                                size={14}
                                color={fromColor(isDark ? Colors.white : Colors.grayDark)
                                    .alpha(0.3)
                                    .rgb()
                                    .toString()}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );
};

export default AiReservation;
