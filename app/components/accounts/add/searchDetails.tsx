import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {ReactElement, useCallback, useEffect, useMemo, useRef} from 'react';
import {Alert, Linking, Platform, Text, View} from 'react-native';
import HTML from 'react-native-render-html';

import {isIOS} from '../../../helpers/device';
import {handleOpenUrlAnyway} from '../../../helpers/handleOpenUrl';
import {PathConfig} from '../../../navigation/linking';
import API from '../../../services/api';
import {navigateByPath} from '../../../services/navigator';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import EmptyRow from './emptyRow';
import styles, {activeBackgroundColor, activeBackgroundColorDark, rippleColor, rippleColorDark} from './styles';

type SearchDetailsProps = {
    message: string;
    refresh: () => void;
};

type ISearchDetails = React.FunctionComponent<SearchDetailsProps>;

const SearchDetails: ISearchDetails = ({message, refresh}) => {
    const isDark = useDark();
    const indexes = useRef<{
        listIndex: number;
        containerIndex: number;
        pointIndex: number;
    }>({
        listIndex: 0,
        containerIndex: 0,
        pointIndex: 0,
    });
    const colorText = useMemo(() => Colors.grayDark, []);
    const colorTextDark = useMemo(() => (isIOS ? Colors.white : DarkColors.text), []);
    const isOne = useMemo(() => message.indexOf('warning') === -1 && message.split('</container><container>').length === 1, [message]);
    const tagsStyles = useMemo(
        () => ({
            a: {
                fontFamily: Fonts.regular,
                textDecorationLine: 'none',
                color: isDark ? colorTextDark : colorText,
            },
            ul: {
                paddingLeft: 0,
                marginTop: 10,
                marginRight: 15,
            },
        }),
        [colorText, colorTextDark, isDark],
    );
    const baseFontStyle = useMemo(
        () => ({
            fontFamily: Fonts.regular,
            color: isDark ? colorTextDark : colorText,
        }),
        [colorText, colorTextDark, isDark],
    );
    const classesStyles = useMemo(
        () => ({
            icon: {
                marginHorizontal: 15,
            },
            content: {
                flex: 1,
            },
            linkWrap: {
                marginVertical: 15,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: isDark ? DarkColors.border : Colors.gray,
                paddingLeft: isOne ? 15 : 0,
            },
            buttonWrap: {
                borderBottomWidth: 1,
                borderBottomColor: isDark ? DarkColors.border : Colors.gray,
                marginBottom: 15,
                marginRight: 15,
            },
            title: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 15,
                marginLeft: isOne ? 15 : 0,
                marginRight: 15,
            },
            surveys: {
                flex: 1,
            },
            requests: {
                alignItems: 'flex-end',
            },
            greenBold: {
                fontWeight: 'bold',
                color: isDark ? DarkColors.green : Colors.green,
            },
            text: {
                marginLeft: isOne ? 15 : 0,
                paddingRight: 15,
            },
            bigText: {
                fontSize: 16,
                fontFamily: Fonts.bold,
            },
            smallText: {
                fontSize: 14,
            },
            marginBottom: {
                // marginBottom: 15,
            },
            blue: {
                fontFamily: Fonts.bold,
                fontSize: 14,
                color: isDark ? DarkColors.blue : Colors.blue,
            },
        }),
        [isDark, isOne],
    );

    const resetIndexes = useCallback(() => {
        indexes.current = {
            listIndex: 0,
            containerIndex: 0,
            pointIndex: 0,
        };
    }, []);

    const alterData = useCallback((node) => node.data.replace(/\s+/g, ' '), []);

    const onPressLink = useCallback((href) => {
        if (href === 'ContactUs') {
            return navigateByPath(PathConfig.ContactUs);
        }

        if (href.startsWith('mailto') !== -1) {
            return Linking.openURL(href);
        }

        return handleOpenUrlAnyway({url: href});
    }, []);

    const onPressButton = useCallback(
        async (href) => {
            const {data} = await API.post(href);
            const {success, message} = data;

            if (!success && _.isString(message)) {
                Alert.alert(message);
            }

            resetIndexes();
            refresh();
        },
        [refresh, resetIndexes],
    );

    const onPressCustomAccount = useCallback(() => {
        navigateByPath(PathConfig.AccountAdd, {providerId: 'custom'});
    }, []);

    const renderSeparator = useCallback(() => <View style={[styles.separator, isDark && styles.separatorDark]} />, [isDark]);

    const renderListItem = useCallback((): ReactElement => {
        indexes.current.listIndex += 1;

        return (
            <View style={[styles.point, styles.marginPoint, isDark && styles.pointDark]}>
                <Text style={styles.pointText}>{indexes.current.listIndex}</Text>
            </View>
        );
    }, [isDark]);

    const renderContainer = useCallback(
        (_htmlAttribs, children): ReactElement => {
            indexes.current.containerIndex += 1;

            return (
                <View key={`container-${indexes.current.containerIndex}`}>
                    {indexes.current.containerIndex > 1 && renderSeparator()}
                    <View style={[styles.lonelyContainerItem, !isOne && styles.containerItem]}>{children}</View>
                </View>
            );
        },
        [isOne, isDark],
    );

    const renderIcon = useCallback(
        (htmlAttribs, _children, _convertedCSSStyles, passProps): ReactElement | null => {
            switch (htmlAttribs.class) {
                case 'warning':
                    return <Icon key='warning' name='warning' color={isDark ? DarkColors.orange : Colors.orange} size={18} />;

                case 'point': {
                    if (isOne) {
                        return null;
                    }

                    let content = '';

                    if (_.isArray(passProps?.transientChildren) && _.isString(passProps?.transientChildren[0]?.data)) {
                        content = passProps?.transientChildren[0]?.data;
                    } else {
                        indexes.current.pointIndex += 1;
                        content = indexes.current.pointIndex.toString();
                    }

                    return (
                        <View key={`point-${content}`} style={[styles.point, isDark && styles.pointDark]}>
                            <Text style={styles.pointText}>{content}</Text>
                        </View>
                    );
                }

                default:
                    return null;
            }
        },
        [isDark],
    );

    const renderLink = useCallback(
        (htmlAttribs, children, _convertedCSSStyles, passProps): ReactElement => {
            const {class: classTag, href} = htmlAttribs;
            const classesTag = _.isString(classTag) ? classTag.split(' ') : [];
            const iconSuccessColor = Platform.select({
                ios: isDark ? DarkColors.text : Colors.grayDark,
                android: isDark ? Colors.grayDarkLight : Colors.white,
            });

            if (classesTag.includes('button')) {
                if (classesTag.includes('voted')) {
                    return (
                        <View key='button-voted' style={[styles.linkButtonWrap, isOne && styles.lonelyLinkButtonWrap]}>
                            <TouchableBackground
                                rippleColor={isDark ? rippleColorDark : rippleColor}
                                activeBackgroundColor={isDark ? DarkColors.grayLight : Colors.grayDarkLight}
                                style={[
                                    styles.linkButton,
                                    styles.linkButtonVoted,
                                    isDark && styles.linkButtonDark,
                                    isDark && styles.linkButtonVotedDark,
                                ]}>
                                <Icon name='success' color={iconSuccessColor} size={20} />
                            </TouchableBackground>
                        </View>
                    );
                }

                return (
                    <View key='button' style={[styles.linkButtonWrap, isOne && styles.lonelyLinkButtonWrap]}>
                        <TouchableBackground
                            rippleColor={isDark ? rippleColorDark : rippleColor}
                            activeBackgroundColor={isDark ? DarkColors.blue : Colors.blue}
                            onPress={() => onPressButton(href)}
                            style={[styles.linkButton, isDark && styles.linkButtonDark]}>
                            <Text style={styles.linkButtonText}>{passProps.transientChildren[0].data}</Text>
                        </TouchableBackground>
                    </View>
                );
            }

            if (classesTag.includes('row')) {
                return (
                    <TouchableBackground
                        key='row'
                        rippleColor={isDark ? rippleColorDark : rippleColor}
                        activeBackgroundColor={isDark ? activeBackgroundColorDark : activeBackgroundColor}
                        onPress={() => onPressLink(href)}
                        style={styles.linkRow}>
                        <Text>{children}</Text>
                        <Icon name='arrow' color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={18} />
                    </TouchableBackground>
                );
            }

            console.log(passProps);

            return (
                <Text key='link' onPress={() => onPressLink(href)} style={[styles.link, isDark && styles.linkDark]}>
                    {passProps.transientChildren[0].data}
                </Text>
            );
        },
        [isDark, isOne, onPressButton, onPressLink],
    );

    const renderCustomAccount = useCallback(
        (): ReactElement => (
            <View key='customAccount'>
                <View style={{height: 15}} />
                {renderSeparator()}
                <EmptyRow
                    item={{
                        KindID: 'custom',
                        Name: Translator.trans('custom.account.list.title', {}, 'mobile'),
                        Notice: Translator.trans('custom.account.list.notice', {}, 'mobile'),
                    }}
                    style={[!isOne && styles.customAccount]}
                    onPress={onPressCustomAccount}
                />
            </View>
        ),
        [isOne, renderSeparator, onPressCustomAccount],
    );

    const listsPrefixesRenderers = useMemo(
        () => ({
            ol: renderListItem,
        }),
        [renderListItem],
    );

    const renderers = useMemo(
        () => ({
            container: renderContainer,
            i: renderIcon,
            a: renderLink,
            'custom-account': renderCustomAccount,
        }),
        [renderContainer, renderCustomAccount, renderIcon, renderLink],
    );

    useEffect(() => {
        resetIndexes();
    }, []);

    return (
        <HTML
            source={{html: message}}
            alterData={alterData}
            tagsStyles={tagsStyles}
            baseFontStyle={baseFontStyle}
            classesStyles={classesStyles}
            listsPrefixesRenderers={listsPrefixesRenderers}
            renderers={renderers}
        />
    );
};

export default SearchDetails;
