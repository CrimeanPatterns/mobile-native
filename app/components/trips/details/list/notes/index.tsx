import Icon from '@components/icon';
import {TouchableOpacity} from '@components/page/touchable';
import {Attachments} from '@components/trips/details/list';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {Text, TextStyle, View} from 'react-native';
import HTML, {ContainerProps} from 'react-native-render-html';
import {Path, Polygon, Svg} from 'react-native-svg';

import {isIOS} from '../../../../../helpers/device';
import {handleOpenUrlAnyway} from '../../../../../helpers/handleOpenUrl';
import {Colors, DarkColors, Fonts} from '../../../../../styles';
import {useColorTheme, useDark} from '../../../../../theme';
import {InsideStackScreenParams, TripStackParamList} from '../../../../../types/navigation';
import {NotesAndAttachmentsBlock} from '../../../../../types/trips/blocks';
import styles from '../styles';
import {ul} from './renderers';

type INotes = React.FunctionComponent<NotesAndAttachmentsBlock>;

const baseFontSize = isIOS ? 15 : 14;

const Notes: INotes = ({name, val}) => {
    const {notes, files} = val;
    const isDark = useDark();
    const color = Colors.grayDark;
    const colorDark = isIOS ? Colors.white : DarkColors.text;
    const navigation = useNavigation<StackNavigationProp<InsideStackScreenParams, 'ModalScreens'>>();
    const route = useRoute<RouteProp<TripStackParamList, 'TimelineSegmentDetails'>>();
    const selectColor = useColorTheme();

    const onLinkPress = useCallback((_, href) => {
        handleOpenUrlAnyway({url: href});
    }, []);

    const baseFontStyle: TextStyle = useMemo(
        () => ({
            fontSize: baseFontSize,
            fontFamily: Fonts.regular,
            color: isDark ? colorDark : color,
        }),
        [isDark, colorDark, color],
    );

    const listPrefixesRenderers = useMemo(
        (): ContainerProps['listsPrefixesRenderers'] => ({
            // @ts-ignore
            ol: (_htmlAttribs, _children, _convertedCSSStyles, {nodeIndex}) => (
                <Text style={[baseFontStyle, {marginRight: 5}]}>{nodeIndex + 1}.</Text>
            ),
            ul: () => (
                <View
                    style={{
                        marginRight: 10,
                        width: baseFontSize / 2.8,
                        height: baseFontSize / 2.8,
                        marginTop: baseFontSize / 2,
                        borderRadius: baseFontSize / 2.8,
                        backgroundColor: isDark ? colorDark : color,
                    }}
                />
            ),
        }),
        [baseFontStyle, color, colorDark, isDark],
    );

    return (
        <View style={[styles.notesAndAttachmentsContainer, isDark && styles.notesAndAttachmentsContainerDark]}>
            <View style={[styles.container, styles.notesBlockContainer, isDark && styles.containerDark]}>
                <View style={{flex: 1}}>
                    <View style={styles.headerWrap}>
                        <Text style={[styles.text, isDark && styles.textDark]}>{name}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ModalScreens', {
                                    screen: `TimelineNote`,
                                    params: {id: route.params?.id, isTravelPlan: false},
                                });
                            }}>
                            <Icon
                                name={'footer-edit'}
                                size={24}
                                color={isIOS ? selectColor(Colors.blue, DarkColors.blue) : selectColor(Colors.green, DarkColors.green)}
                            />
                        </TouchableOpacity>
                    </View>
                    {_.isEmpty(notes) === false && (
                        <View style={{marginBottom: 12}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[styles.notesContainerHeader, isDark && styles.notesBorderDark, isDark && styles.notesBackgroundDark]} />
                                <Svg width={14} height={14}>
                                    <Polygon points={'14,14 0,0 0,14 '} fill={isDark ? DarkColors.bgLight : Colors.grayLight} />
                                    <Path d='M0 9C0 11.7614 2.23858 14 5 14H14L0 0V9Z' fill={isDark ? DarkColors.gray : Colors.gray} />
                                </Svg>
                            </View>
                            <HTML
                                source={{html: notes}}
                                containerStyle={[styles.notesContainer, isDark && styles.notesBorderDark, isDark && styles.notesBackgroundDark]}
                                tagsStyles={{
                                    a: {
                                        color: isDark ? DarkColors.blue : Colors.blue,
                                    },
                                    p: {
                                        marginTop: 0,
                                        marginBottom: 0,
                                    },
                                    ul: {
                                        marginBottom: -10,
                                    },
                                    i: {fontStyle: 'italic'},
                                }}
                                listsPrefixesRenderers={listPrefixesRenderers}
                                renderers={{
                                    ul,
                                    ol: ul,
                                }}
                                baseFontStyle={baseFontStyle}
                                defaultTextProps={{
                                    selectable: true,
                                }}
                                onLinkPress={onLinkPress}
                            />
                        </View>
                    )}
                </View>
            </View>
            <Attachments val={files} />
        </View>
    );
};

export default Notes;
