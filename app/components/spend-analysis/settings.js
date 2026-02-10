import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {isAndroid, isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import Form, {stylesMaker} from '../form';
import Icon from '../icon';
import HeaderButton from '../page/header/button';
import ThemedModal from '../page/modal';

const mainColor = Colors.chetwodeBlue;
const mainColorDark = DarkColors.chetwodeBlue;
const SubTitle = require('../profile/overview/plainSubTitle').default;

@withTheme
class SpendAnalysisSettings extends BaseThemedPureComponent {
    // TODO: do not remove, used in mobile site
    static title = Translator.trans(/** @Desc("Spend Analysis Settings") */ 'spend-analysis.settings', {}, 'mobile-native');

    static customTypes = {
        subTitle: {
            component: React.forwardRef((props, ref) => <SubTitle ref={ref} {...Platform.select({android: {color: mainColor}})} {...props} />),
            simpleComponent: true,
        },
    };

    constructor(props) {
        super(props);

        this.state = {
            fields: null,
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    onSubmit(fields) {
        this.safeSetState({fields});
    }

    get headerButtonRight() {
        return () => {
            const {fields} = this.state;

            const color = this.isDark ? DarkColors.blue : Colors.blueDark;

            return (
                <HeaderButton
                    disabled={_.isNull(fields)}
                    onPress={this.applySettings}
                    title={isIOS ? Translator.trans(/** @Desc("Apply") */ 'button.apply', {}, 'mobile-native') : undefined}
                    iconName={isIOS ? undefined : 'android-baseline-check'}
                    color={isIOS ? color : undefined}
                />
            );
        };
    }

    renderFooter = () => {
        const iconColor = this.themeColors.grayDarkLight;

        return (
            <View style={styles.footer}>
                <Text style={[styles.label, this.isDark && styles.textDark]}>{isIOS ? 'Information'.toUpperCase() : 'Information'}</Text>
                <View style={styles.row}>
                    <Icon name='card-personal' color={iconColor} size={24} />
                    <View style={styles.textWrap}>
                        <Text style={[styles.text, this.isDark && styles.textDark]}>Personal card</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Icon name='card-business' color={iconColor} size={24} />
                    <View style={styles.textWrap}>
                        <Text style={[styles.text, this.isDark && styles.textDark]}>Business card</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Icon name='card-have' color={iconColor} size={24} />
                    <View style={styles.textWrap}>
                        <Text style={[styles.text, this.isDark && styles.textDark]}>I have this card</Text>
                    </View>
                </View>
                {/* <View style={styles.row}>
                <Icon name='card-bonus-limit' color={iconColor} size={24}/>
                <View style={styles.textWrap}>
                    <Text style={styles.text}>Bonus spend limit reached</Text>
                </View>
            </View> */}
            </View>
        );
    };

    applySettings = () => {
        const {fields} = this.state;
        const {onApply} = this.props;

        onApply(fields);
    };

    render() {
        const {form, onClose} = this.props;
        const {children, jsProviderExtension} = form;

        return (
            <ThemedModal
                presentationStyle={isAndroid ? 'fullScreen' : 'pageSheet'}
                visible
                onClose={onClose}
                headerRight={this.headerButtonRight}
                headerColor={this.isDark ? DarkColors.bgLight : Colors.chetwodeBlue}>
                <SafeAreaView style={[styles.page, this.isDark && styles.pageDark]}>
                    <Form
                        fields={children}
                        autoSubmit
                        autoSubmitDelay={0}
                        onSubmit={this.onSubmit}
                        formExtension={jsProviderExtension}
                        customTypes={SpendAnalysisSettings.customTypes}
                        fieldsStyles={isAndroid ? stylesMaker(this.selectColor(mainColor, mainColorDark)) : undefined}
                        footerComponent={this.renderFooter}
                    />
                </SafeAreaView>
            </ThemedModal>
        );
    }
}

export default SpendAnalysisSettings;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
            },
        }),
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    footer: {
        ...Platform.select({
            ios: {
                marginTop: 12,
                marginBottom: 22,
            },
            android: {
                marginVertical: 20,
            },
        }),
    },
    headerButton: {
        paddingHorizontal: 10,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 16,
            },
            android: {
                fontSize: 17,
            },
        }),
    },
    label: {
        fontFamily: Fonts.regular,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                fontSize: 12,
                color: Colors.grayDark,
            },
            android: {
                fontSize: 16,
                color: Colors.chetwodeBlue,
            },
        }),
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingLeft: 15,
        marginVertical: 4,
    },
    textWrap: {
        flex: 1,
        paddingLeft: 14,
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDark,
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
});
