import _ from 'lodash';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import HTML from 'react-native-render-html';

import {isIOS} from '../../helpers/device';
import {handleOpenUrlAnyway} from '../../helpers/handleOpenUrl';
import {Colors, DarkColors} from '../../styles';
import {useDark} from '../../theme';
import Icon from '../icon';
import CrookedSeparator from '../page/crookedSeparator';
import styles, {subheaderHeight, subheaderHeightColor, subheaderHeightColorDark} from './styles';

export type TransferTimesRowProps = {
    program: string;
    duration: string;
    tip?: string;
    info?: string;
};

type TitleProps = {
    program: string;
};

type ITransferTimesRow = React.FunctionComponent<TransferTimesRowProps> & {
    Title: React.FunctionComponent<TitleProps>;
    SubTitle: React.FunctionComponent<TransferTimesRowProps>;
};

const TransferTimesRow: ITransferTimesRow = ({program, duration, tip, info}) => {
    const isDark = useDark();
    const color = Colors.grayDark;
    const colorDark = isIOS ? Colors.white : DarkColors.text;

    const onLinkPress = useCallback((_, href) => {
        handleOpenUrlAnyway({url: href});
    }, []);

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.row}>
                <Text style={[styles.program, styles.text, isDark && styles.textDark]} numberOfLines={2}>
                    {program}
                </Text>

                <View style={styles.duration}>
                    <Text style={[styles.text, isDark && styles.textDark]}>{duration}</Text>
                    {_.isString(tip) && <Text style={[styles.tip, isDark && styles.tipDark]}>{tip}</Text>}
                </View>
            </View>
            {_.isString(info) && (
                <View style={[styles.info, isDark && styles.infoDark]}>
                    <Icon name='menu-about' color={isDark ? DarkColors.blue : Colors.blue} size={18} />
                    <View style={styles.infoMessage}>
                        <HTML
                            tagsStyles={{
                                a: {
                                    ...styles.textLink,
                                    color: isDark ? DarkColors.blue : Colors.blue,
                                },
                            }}
                            baseFontStyle={{
                                ...styles.textSmall,
                                color: isDark ? colorDark : color,
                            }}
                            defaultTextProps={{
                                selectable: true,
                            }}
                            source={{html: info}}
                            onLinkPress={onLinkPress}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

TransferTimesRow.SubTitle = React.memo<TransferTimesRowProps>(({program, duration, tip, info}) => {
    const isDark = useDark();

    return (
        <>
            <View style={[styles.subheader, isDark && styles.subheaderDark]}>
                <Text style={[styles.subTitle, isDark && styles.subTitleDark]}>To:</Text>
            </View>
            <CrookedSeparator
                backgroundColor={isDark ? subheaderHeightColorDark : subheaderHeightColor}
                style={{line: {top: subheaderHeight}, arrow: {top: subheaderHeight - 4}}}
            />
            <TransferTimesRow program={program} duration={duration} tip={tip} info={info} />
        </>
    );
});

TransferTimesRow.Title = React.memo<TitleProps>(({program}) => {
    const isDark = useDark();

    return (
        <View style={[styles.header, styles.container, isDark && styles.containerDark]}>
            <Text style={[styles.title, isDark && styles.titleDark]}>{program}</Text>
        </View>
    );
});

export default TransferTimesRow;
