import {useNavigation} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {isAndroid, isTablet} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {useTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import ActionSheet from '../actionSheet';
import {TouchableItem} from '../touchable/index';

class BottomMenu extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                icon: PropTypes.oneOfType([PropTypes.object, PropTypes.element]).isRequired,
                state: PropTypes.object,
                onPress: PropTypes.func,
            }),
        ).isRequired,
        navigation: PropTypes.object.isRequired,
    };

    static defaultProps = {
        items: [],
    };

    static getDerivedStateFromProps(nextProps) {
        const {items} = nextProps;

        return BottomMenu.getMenu(items);
    }

    static getMenu(items) {
        const {width} = Dimensions.get('window');
        const menuLength = BottomMenu.getMenuLength(width, items.length);

        return {
            menu: items,
            items: items.slice(0, menuLength),
            actionSheet: items.slice(menuLength),
        };
    }

    static getMenuLength(width, length) {
        let menuLength = 5;

        if (isTablet) {
            if (width <= 600) {
                menuLength = 6;
            } else {
                menuLength = 8;
            }
        } else if (length > menuLength) {
            menuLength = 4;
        }

        return menuLength;
    }

    state = {
        menu: [],
        items: [],
        actionSheet: [],
        width: null,
    };

    constructor(props) {
        super(props);

        this.actionSheet = null;

        this.renderItem = this.renderItem.bind(this);
        this.onPress = this.onPress.bind(this);
        this.orientationDidChange = this.orientationDidChange.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        if (isTablet) {
            this.dimensionsListener = Dimensions.addEventListener('change', this.orientationDidChange);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {width: prevWidth} = prevState;
        const {items} = this.props;
        const {width} = this.state;

        if (width !== prevWidth && items.length > BottomMenu.getMenuLength(width, items.length)) {
            this.safeSetState(BottomMenu.getMenu(items));
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        if (isTablet) {
            this.dimensionsListener?.remove();
        }
    }

    safeSetState(state, cb) {
        if (this.mounted) {
            this.setState(state, cb);
        }
    }

    orientationDidChange(e) {
        const {width} = e.window;

        this.safeSetState({width});
    }

    onPress(index) {
        const {navigation} = this.props;
        const {menu} = this.state;

        if (menu && menu[index]) {
            const item = menu[index];

            if (item.onPress && _.isFunction(item.onPress)) {
                item.onPress();
            }

            if (item.state && _.isObject(item.state)) {
                const {routeName, params} = item.state;

                navigation.navigate(routeName, params);
            }
        }
    }

    actionSheetOnPress = (index) => this.onPress(this.state.items.length + index);

    renderItem(item, index) {
        const {key, title, icon} = item;
        let style;

        if (!isTablet) {
            style = {width: '20%', maxWidth: 250};
        }

        return (
            <TouchableItem
                delayPressIn={0}
                style={[style, isTablet && {maxWidth: 200, width: 100}]}
                borderless
                key={key}
                onPress={() => this.onPress(index)}>
                <View style={[styles.col]} pointerEvents='box-only'>
                    <View style={styles.iconContainer}>
                        {React.isValidElement(icon) ? icon : <Icon style={[styles.icon, this.isDark && styles.iconDark]} size={24} {...icon} />}
                    </View>
                    <Text style={[styles.text, this.isDark && styles.textDark]} numberOfLines={2} ellipsizeMode='tail'>
                        {title}
                    </Text>
                </View>
            </TouchableItem>
        );
    }

    renderActionSheetItem = (item) => {
        const {title, icon} = item;
        const iconColor = this.selectColor(Colors.blue, DarkColors.blue);

        return {
            component: (
                <View style={[styles.menuItem]}>
                    <View style={styles.menuIcon}>
                        <View style={styles.menuIconItem}>
                            <Icon color={iconColor} size={24} {...icon} />
                        </View>
                    </View>
                    <Text style={[styles.menuText, this.isDark && styles.menuTextDark]}>{title}</Text>
                </View>
            ),
            // height: 60,
        };
    };

    render() {
        const {items, actionSheet} = this.state;

        return (
            <SafeAreaView style={[styles.menuContainer, this.isDark && styles.darkBg]} edges={['bottom']}>
                <View style={[styles.menu, this.isDark && styles.menuDark, items.length < 4 && {paddingHorizontal: 0}]}>
                    <View style={{flexDirection: 'column', flex: 1}}>
                        <View style={[styles.container]}>{items.map(this.renderItem)}</View>
                    </View>
                    {actionSheet.length > 0 && (
                        <TouchableOpacity onPress={() => this.actionSheet.show()}>
                            <View style={[styles.col]}>
                                <View style={styles.iconContainer}>
                                    <Icon style={styles.icon} size={24} name='footer-more' />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                <ActionSheet
                    ref={(ref) => (this.actionSheet = ref)}
                    options={actionSheet.map(this.renderActionSheetItem)}
                    cancelButton={Translator.trans('cancel', {}, 'messages')}
                    style={isAndroid && actionSheetStyles}
                    tintColor={Platform.select({android: Colors.grayDarkLight})}
                    onCancel={_.noop}
                    onPress={this.actionSheetOnPress}
                    buttonUnderlayColor={this.selectColor('#f9f9f9', DarkColors.bgLight)}
                />
            </SafeAreaView>
        );
    }
}

const actionSheetStyles = {
    cancelTitle: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: Colors.grayDarkLight,
    },
};

const styles = StyleSheet.create({
    darkBg: {
        backgroundColor: DarkColors.bg,
    },
    menuContainer: {
        backgroundColor: Colors.grayLight,
    },
    menu: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
                borderTopColor: Colors.gray,
                borderTopWidth: 1,
            },
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
    menuDark: {
        backgroundColor: DarkColors.bg,
        borderTopColor: DarkColors.border,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: isTablet ? 'center' : 'space-evenly',
    },
    col: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 5,
    },
    icon: Platform.select({
        ios: {
            color: IconColors.gray,
        },
        android: {
            color: Colors.grayDarkLight,
        },
    }),
    iconDark: {
        color: DarkColors.grayLight,
    },
    text: {
        fontFamily: Fonts.regular,
        textAlign: 'center',
        marginTop: 5,
        fontSize: 10,
        lineHeight: 10,
        ...Platform.select({
            ios: {
                color: '#4c4c4c',
            },
            android: {
                color: Colors.grayDarkLight,
            },
        }),
    },
    textDark: {
        color: DarkColors.grayLight,
    },
    menuItem: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
    },
    menuIcon: {
        // width: 70,
    },
    menuIconItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuText: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: Colors.black,
        paddingLeft: 25,
    },
    menuTextDark: {
        color: Colors.white,
    },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({items}) => {
    const theme = useTheme();
    const navigation = useNavigation();

    return <BottomMenu items={items} theme={theme} navigation={navigation} />;
};
