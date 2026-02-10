import Translator from 'bazinga-translator';
import React from 'react';
import {Dimensions, FlatList, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {isAndroid, isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import {Colors, DarkColors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import styles from '../style';

let userPanePicture;

export const getUserPanePicture = () => {
    if (!userPanePicture) {
        userPanePicture = require('../../../assets/images/picture.png');
    }

    return userPanePicture;
};

class MenuContent extends BaseThemedPureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            items: [
                {
                    title: Translator.trans('credit-card.merchant_lookup_title', {}, 'messages'),
                    icon: {
                        name: 'menu-merchant-lookup',
                        size: 24,
                    },
                    routeName: 'MerchantLookup',
                },
                {
                    title: Translator.trans('about.us.link', {}, 'messages'),
                    icon: {
                        name: 'menu-about',
                        size: 24,
                    },
                    routeName: 'AboutUs',
                },
                {
                    title: Translator.trans('privacy.notice.link', {}, 'messages'),
                    icon: {
                        name: 'menu-privacy',
                        size: 24,
                    },
                    routeName: 'PrivacyNotice',
                },
                {
                    title: Translator.trans('termsofuse.link', {}, 'messages'),
                    icon: {
                        name: 'menu-terms',
                        size: 24,
                    },
                    routeName: 'Terms',
                },
                {
                    title: Translator.trans('menu.contact-us', {}, 'menu'),
                    icon: {
                        name: 'menu-contact-us',
                        size: 24,
                    },
                    routeName: 'ContactUs',
                },
            ],
        };
    }

    _onMenuItemPress(index) {
        const {navigation} = this.props;
        const {items} = this.state;

        navigation.closeDrawer();
        navigation.navigate(items[index].routeName);
    }

    _onMenuItemPressIn(selected) {
        this.setState({selected});
    }

    _onMenuItemPressOut() {
        this.setState({
            selected: null,
        });
    }

    renderSeparator = () => <View style={[styles.separator, this.isDark && style.separatorDark]} />;

    renderMenuItem = ({item, index}) => {
        const {selected} = this.state;
        const TouchableMenuItem = getTouchableComponent();
        const styleSelected = this.isDark ? styles.menuActiveDark || styles.menuActive : styles.menuActive;

        return (
            <TouchableMenuItem
                delayPressIn={0}
                onPress={this._onMenuItemPress.bind(this, index)}
                onPressIn={this._onMenuItemPressIn.bind(this, index)}
                onPressOut={this._onMenuItemPressOut.bind(this, index)}>
                <View style={[styles.menuItem, isAndroid && selected === index ? styleSelected : null]} pointerEvents='box-only'>
                    <View>
                        <View style={styles.menuIcon}>
                            <Icon color={isIOS ? IconColors.gray : Colors.grayDarkLight} {...item.icon} style={[this.isDark && style.textDark]} />
                        </View>
                    </View>
                    <Text style={[styles.menuText, this.isDark && style.textDark, isIOS && selected === index ? styleSelected : null]}>
                        {item.title}
                    </Text>
                </View>
            </TouchableMenuItem>
        );
    };

    keyExtractor = ({routeName}) => routeName;

    render() {
        const {items} = this.state;
        const {height} = Dimensions.get('window');

        return (
            <SafeAreaView style={[style.pageMenu, this.isDark && style.pageMenuDark]}>
                {isAndroid && <View style={{height: height * 0.1}} />}
                <View style={style.pageMenuItem}>
                    <FlatList
                        style={[styles.menu, {paddingTop: StatusBar.currentHeight}]}
                        data={items}
                        extraData={this.state}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderMenuItem}
                        ItemSeparatorComponent={this.renderSeparator}
                        alwaysBounceVertical={false}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    pageMenu: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
                borderRightWidth: 1,
                borderRightColor: '#dfe1e6',
            },
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
    pageMenuDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
                borderRightColor: DarkColors.border,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    pageMenuItem: {
        ...Platform.select({
            ios: {
                paddingTop: 50,
            },
        }),
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
});

export default withTheme(MenuContent);
