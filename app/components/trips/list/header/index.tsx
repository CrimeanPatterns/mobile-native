import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import HTML from 'react-native-render-html';

import {isIOS} from '../../../../helpers/device';
import {PathConfig} from '../../../../navigation/linking';
import {navigateByPath} from '../../../../services/navigator';
import {Colors, DarkColors, Fonts} from '../../../../styles';
import {IconColors} from '../../../../styles/icons';
import {useDark} from '../../../../theme';
import Icon from '../../../icon';
import {TouchableBackground} from '../../../page/touchable';
import {ProfileOwnerTravelSummaryStatistics} from '../../../travel-summary/statistics';
import styles from './styles';

type TimelineListHeaderProps = {
    itineraryForwardEmail: string;
    pastTravel: () => void;
    loading?: boolean;
    showPastTravel?: boolean;
    showNotice?: boolean;
    showTravelSummary?: boolean;
};

type ITimelineListHeader = React.FunctionComponent<TimelineListHeaderProps>;

const TimelineListHeader: ITimelineListHeader = ({
    itineraryForwardEmail,
    pastTravel,
    loading = false,
    showPastTravel = false,
    showNotice = true,
    showTravelSummary = false,
}) => {
    const isDark = useDark();
    const [inPressTravelSummaryStatistics, setPressTravelSummaryStatistics] = useState<boolean>(false);
    const labels = {
        pastTravel: Translator.trans('timeline.past.travel', {}, 'messages'),
        showDeleted: Translator.trans('show.deleted.segments'),
        hideDeleted: Translator.trans('hide.deleted.segments'),
    };
    const textColor = '#212121';
    const textColorDark = isIOS ? Colors.white : DarkColors.text;
    const iconColor = IconColors.gray;
    const iconColorDark = isIOS ? Colors.white : DarkColors.gray;
    const tagsStyles = useMemo(
        () => ({
            p: {
                fontSize: 13,
                fontFamily: Fonts.regular,
                color: isDark ? textColorDark : textColor,
                lineHeight: 20,
                flex: 1,
            },
            a: {
                fontSize: 13,
                color: isDark ? DarkColors.blue : Colors.blue,
                textDecorationLine: 'none',
                fontFamily: isIOS ? Fonts.bold : Fonts.regular,
            },
            span: {
                fontSize: 14,
                lineHeight: 20,
                fontFamily: Fonts.regular,
                paddingVertical: 5,
                paddingHorizontal: 5,
                ...Platform.select({
                    ios: {
                        backgroundColor: isDark ? DarkColors.blue : Colors.blue,
                        color: Colors.white,
                    },
                    android: {
                        color: isDark ? Colors.black : Colors.white,
                        backgroundColor: isDark ? DarkColors.green : Colors.green,
                    },
                }),
            },
        }),
        [isDark, textColorDark],
    );

    const bgColor = useMemo<string>(() => {
        if (isIOS) {
            if (inPressTravelSummaryStatistics) {
                return isDark ? DarkColors.bg : Colors.grayLight;
            }

            return isDark ? DarkColors.bgLight : Colors.white;
        }

        return isDark ? DarkColors.bg : Colors.white;
    }, [inPressTravelSummaryStatistics, isDark]);

    const onLinkPress = useCallback(() => {
        navigateByPath(PathConfig.Mailboxes, {source: 'timeline_header'});
    }, []);

    return (
        <>
            {showTravelSummary && (
                <TouchableBackground
                    onPress={() => {
                        navigateByPath(PathConfig.TravelSummary);
                    }}
                    onPressIn={() => {
                        setPressTravelSummaryStatistics(true);
                    }}
                    onPressOut={() => {
                        setPressTravelSummaryStatistics(false);
                    }}
                    rippleColor={isDark ? DarkColors.border : Colors.grayLight}
                    activeBackgroundColor={isDark ? DarkColors.bg : Colors.grayLight}
                    style={[styles.travelSummary, isDark && styles.travelSummaryDark]}>
                    <ProfileOwnerTravelSummaryStatistics size={50} bgColor={bgColor} />
                </TouchableBackground>
            )}
            {showNotice && (
                <View style={[styles.top, isDark && styles.topDark]}>
                    <View
                        accessible
                        accessibilityLabel={Translator.trans(
                            'scanner.link_mailbox_or_forward',
                            {
                                link_on: '',
                                link_off: '',
                                email: itineraryForwardEmail,
                            },
                            'messages',
                        )}>
                        <HTML
                            tagsStyles={tagsStyles}
                            baseFontStyle={{
                                fontSize: 13,
                                fontFamily: Fonts.regular,
                                color: isDark ? textColorDark : textColor,
                                lineHeight: 20,
                            }}
                            defaultTextProps={{
                                selectable: false,
                            }}
                            source={{
                                html: Translator.trans(
                                    'scanner.link_mailbox_or_forward',
                                    {
                                        link_on: `<a href="#mailboxes">`,
                                        link_off: '</a>',
                                        email: `<span>&nbsp;${itineraryForwardEmail}&nbsp;</span>`,
                                    },
                                    'messages',
                                ),
                            }}
                            onLinkPress={onLinkPress}
                        />
                    </View>
                </View>
            )}
            <View style={styles.topAction}>
                {showPastTravel === true && (
                    <TouchableOpacity
                        delayPressIn={0}
                        disabled={loading}
                        accessibilityLabel={labels.pastTravel}
                        style={styles.pastTravel}
                        onPress={(!loading && pastTravel) || _.noop}
                        hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
                        <Icon name='double-arrow' size={24} color={isDark ? iconColorDark : iconColor} />
                        <Text style={[styles.pastTravelText, isDark && styles.textDark]}>{labels.pastTravel}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
};

export default TimelineListHeader;
