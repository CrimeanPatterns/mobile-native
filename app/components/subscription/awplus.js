import {useLayout} from '@react-native-community/hooks';
import Translator from 'bazinga-translator';
import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SvgXml} from 'react-native-svg';

import {isTablet} from '../../helpers/device';
import {Colors, Fonts} from '../../styles';
import {BaseThemedPureComponent} from '../baseThemed';
import {Button} from '../form';
import {Message} from './message';

const isTrial = false;

const BackgroundView = ({children}) => {
    const {onLayout, ...layout} = useLayout();

    return (
        <ScrollView onLayout={onLayout} style={styles.page} contentInsetAdjustmentBehavior='automatic'>
            <SvgXml key={`gradient_${layout.width}`} style={StyleSheet.absoluteFill} width={layout.width} xml={backgroundGradient} />
            {children}
        </ScrollView>
    );
};

class SubscriptionPlus extends BaseThemedPureComponent {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.purchase = this.purchase.bind(this);
    }

    close() {
        const {navigation} = this.props;

        navigation.goBack();
    }

    isSmallDisplay = () => Dimensions.get('window').width < 350;

    setLoading(loading) {
        if (this.submitButton) {
            this.submitButton.setLoading(loading);
        }
    }

    purchase() {
        this.setLoading(true);
    }

    getPurchaseButtonLabel() {
        return Translator.trans(/** @Desc('Try It Free for 3 Months') */ 'subscription.button', {}, 'mobile-native');
    }

    _renderPaymentButton() {
        const {theme} = this.props;

        return (
            <Button
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                onPress={this.purchase}
                label={this.getPurchaseButtonLabel()}
                color={Colors.white}
                customStyle={{
                    label: {
                        base: {
                            color: Colors.blueDark,
                        },
                        loading: {
                            color: Colors.white,
                        },
                    },
                }}
                theme={theme}
            />
        );
    }

    _renderContent() {
        const isSmallDisplay = this.isSmallDisplay();

        return (
            <View style={[styles.content, isSmallDisplay && styles.contentMin]}>
                <View style={styles.contentRow}>
                    {/* <View style={[!isSmallDisplay && styles.contentColumn, {marginLeft: 5}]}> */}
                    {/*    <Image */}
                    {/*        resizeMode={'contain'} */}
                    {/*        style={[styles.contentImage, {maxWidth: Dimensions.get('window').width / 5}, isSmallDisplay && styles.contentImageMin]} */}
                    {/*        source={require('../../assets/images/plus-airline.png')} */}
                    {/*    /> */}
                    {/* </View> */}
                    <View style={[styles.contentColumn, !isTablet && {flex: 3}]}>{this._renderPaymentButton()}</View>
                    {/* <View style={!isSmallDisplay && styles.contentColumn} /> */}
                </View>
                <View style={[styles.wrapperWidth, {maxWidth: 450}]}>
                    {isTrial && (
                        <Text style={styles.text}>
                            {Translator.trans(/** @Desc('3 Months Free Trial ~ Then $29.99/year') */ 'subscription.trial', {}, 'mobile-native')}
                        </Text>
                    )}
                    <Text style={styles.text}>
                        {Translator.trans(/** @Desc('Recurring Billing ~ Cancel anytime') */ 'subscription.billing', {}, 'mobile-native')}
                    </Text>
                </View>
            </View>
        );
    }

    renderHeader = () => {
        const isSmallDisplay = this.isSmallDisplay();

        return (
            <View style={[styles.logo, isSmallDisplay && styles.logoMin]}>
                <Image
                    resizeMode='contain'
                    style={{maxWidth: isSmallDisplay ? '80%' : '90%'}}
                    source={require('../../assets/images/plus-awardwallet.png')}
                />
            </View>
        );
    };

    renderContent() {
        return (
            <>
                {this.renderHeader()}
                {this._renderContent()}
                <View style={styles.wrapperCenter}>
                    <View style={[styles.wrapperWidth, {maxWidth: 450}]}>
                        {this.renderFooter()}
                        {this.renderTerms()}
                    </View>
                </View>
            </>
        );
    }

    renderFooter = () => {
        const itemsFooter = [
            {
                icon: require('../../assets/images/plus-property.png'),
                header: Translator.trans(/** @Desc('Additional Properties') */ 'subscription.properties.title', {}, 'mobile-native'),
                content: Translator.trans(
                    /** @Desc('Displaying additional reward account properties') */ 'subscription.properties.description',
                    {},
                    'mobile-native',
                ),
            },
            {
                icon: require('../../assets/images/plus-expire.png'),
                header: Translator.trans(/** @Desc('All Expirations') */ 'subscription.expirations.title', {}, 'mobile-native'),
                content: Translator.trans(
                    /** @Desc('Showing all of your loyalty account expirations where expiration is known') */ 'subscription.expirations.description',
                    {},
                    'mobile-native',
                ),
            },
            {
                icon: require('../../assets/images/plus-5x.png'),
                header: Translator.trans(/** @Desc('5x Faster Update') */ 'subscription.update.title', {}, 'mobile-native'),
                content: Translator.trans(
                    /** @Desc('When your update all of your accounts they are updated in parallel, up to 5x faster') */ 'subscription.update.description',
                    {},
                    'mobile-native',
                ),
            },
            {
                icon: require('../../assets/images/plus-flights.png'),
                header: Translator.trans(/** @Desc('Monitoring Flights') */ 'subscription.monitoring.title', {}, 'mobile-native'),
                content: Translator.trans(
                    /** @Desc('More comprehensive monitoring and tracking of your flights') */ 'subscription.monitoring.description',
                    {},
                    'mobile-native',
                ),
            },
        ];

        return (
            <View style={styles.footer}>{itemsFooter.map((item, index) => this.renderItemFooter(index, item.icon, item.header, item.content))}</View>
        );
    };

    renderItemFooter = (index, icon, header, content) => {
        const isSmallDisplay = this.isSmallDisplay();

        return (
            <View key={`item_footer_${index}`} style={styles.footerItem}>
                <View style={styles.footerItemIcon}>
                    <Image source={icon} />
                </View>
                <View style={styles.footerItemText}>
                    <Text style={[styles.text, styles.footerItemHeaderText, isSmallDisplay && styles.footerItemHeaderTextMin]}>{header}</Text>
                    <Text style={[styles.text, isSmallDisplay && styles.footerItemContentTextMin]}>{content}</Text>
                </View>
            </View>
        );
    };

    renderTerms = () => (
        <View style={styles.message}>
            <Message callback={this.close} />
        </View>
    );

    renderModalContent() {
        return (
            <>
                <BackgroundView>{this.renderContent()}</BackgroundView>
                <Image
                    resizeMode='contain'
                    pointerEvents='none'
                    style={styles.bgPageImage}
                    source={require('../../assets/images/plus-wallets.png')}
                />
            </>
        );
    }

    render() {
        return this.renderModalContent();
    }
}

export {SubscriptionPlus};

const backgroundGradient = `
        <svg>
            <defs>
                <radialGradient id="gradient" cx="50%" cy="268.19" r="316.22" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color=${Colors.blue}/>
                    <stop offset="1" stop-color=${Colors.blueDark}/>
                </radialGradient>
            </defs>
            <rect fill="url(#gradient)" width="100%" height="100%"/>
        </svg>`;

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
    page: {
        backgroundColor: Colors.blueDark,
    },
    wrapperCenter: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    wrapperWidth: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 50,
    },
    logoMin: {
        marginTop: 50,
        marginBottom: 30,
    },
    contentRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    contentColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    content: {
        marginBottom: 60,
        alignItems: 'center',
    },
    contentMin: {
        marginBottom: 40,
    },
    // contentImage: {
    //     position: 'absolute',
    //     top: -20,
    // },
    // contentImageMin: {
    //     display: 'none',
    // },
    footer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    footerItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    footerItemIcon: {
        marginRight: 20,
    },
    footerItemText: {
        flex: 1,
        flexDirection: 'column',
    },
    footerItemHeaderText: {
        fontSize: 22,
    },
    footerItemHeaderTextMin: {
        fontSize: 20,
    },
    footerItemContentTextMin: {
        fontSize: 11,
    },
    message: {
        flex: 1,
        marginTop: '20%',
        marginBottom: '20%',
    },
    bgPageImage: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
});
