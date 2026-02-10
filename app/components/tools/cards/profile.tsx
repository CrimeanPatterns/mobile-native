import Translator from 'bazinga-translator';
import formColor from 'color';
import _ from 'lodash';
import React from 'react';
import {Image, Text, View} from 'react-native';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import styles, {avatarColor, avatarColorDark, avatarSize} from './styles';

type CardProfileProps = {
    Free: boolean;
    FullName: string;
    UserEmail: string;
    AvatarImage: string;
    onPress: () => void;
};

type ICardProfile = React.FunctionComponent<CardProfileProps>;

const CardProfile: ICardProfile = ({Free, FullName, UserEmail, AvatarImage, onPress}) => {
    const isDark = useDark();

    // Translator.trans(/** @Desc("Plus" */ 'plus', {}, 'mobile-native')
    // Translator.trans(/** @Desc("Regular" */ 'regular', {}, 'mobile-native')

    return (
        <TouchableBackground
            onPress={onPress}
            rippleColor={isDark ? DarkColors.border : Colors.grayLight}
            activeBackgroundColor={isDark ? DarkColors.bg : Colors.grayLight}
            style={[styles.cardProfile]}>
            <View style={styles.profile}>
                <View style={styles.profileAvatar}>
                    <View style={[styles.avatarFrame, isDark && styles.avatarFrameDark]}>
                        {_.isEmpty(AvatarImage) && <Icon name='avatar' color={isDark ? avatarColorDark : avatarColor} size={avatarSize} />}
                        {!_.isEmpty(AvatarImage) && (
                            <Image
                                style={styles.avatarImage}
                                source={{
                                    uri: AvatarImage,
                                }}
                            />
                        )}
                    </View>
                    <View style={[styles.profileStatusContainer, isDark && styles.profileStatusContainerDark]}>
                        {Free ? (
                            <View style={[styles.profileStatusWrap, styles.regularProfileStatusWrap, isDark && styles.regularProfileStatusWrapDark]}>
                                <Text style={[styles.text, styles.textProfileStatus, isDark && styles.simpleCardGridTextDark]}>{'Regular'}</Text>
                            </View>
                        ) : (
                            <View style={[styles.profileStatusWrap, styles.plusProfileStatusWrap]}>
                                <View style={[styles.profileStatusWrap, styles.plusSmallProfileStatusWrap]}>
                                    <Icon name={'aw-logo'} color={Colors.white} size={17} />
                                    <View style={styles.secondIconWrap}>
                                        <Icon
                                            name={'logo-path1'}
                                            color={formColor(Colors.white).alpha(0.5).rgb().toString()}
                                            size={12}
                                            style={styles.secondIcon}
                                        />
                                    </View>
                                </View>
                                <Text style={[styles.text, styles.textProfileStatus, styles.simpleCardGridTextDark]}>{'Plus'}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.alignItems}>
                    <Text
                        style={[styles.text, styles.textTitle, styles.textBold, isDark && styles.textDark]}
                        numberOfLines={1}
                        accessibilityLabel={FullName}>
                        {FullName}
                    </Text>

                    <Text style={[styles.text, styles.textSmallSubtitle, isDark && styles.textSmallSubtitleDark]}>{UserEmail.toLowerCase()}</Text>
                </View>
            </View>
        </TouchableBackground>
    );
};

export default CardProfile;
