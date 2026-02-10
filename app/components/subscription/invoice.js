import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import {SubmitButton} from '../form';

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.theme === nextProps.theme &&
    prevProps.onContinue === nextProps.onContinue &&
    prevProps.product === nextProps.product &&
    prevProps.submitButtonColor === nextProps.submitButtonColor &&
    prevProps.customStyles === nextProps.customStyles;

const PaymentInvoice = React.memo(({theme, onContinue, product, submitButtonColor, customStyles}) => {
    const isDark = theme === 'dark';
    const invoiceStyles = {...styles, ...customStyles};
    const styleTextDark = isDark && invoiceStyles.textDark;
    const styleDiscount = [invoiceStyles.text, invoiceStyles.boldText, styleTextDark, invoiceStyles.redText, isDark && invoiceStyles.redTextDark];

    return (
        <ScrollView style={[invoiceStyles.page, isDark && invoiceStyles.pageDark]} automaticallyAdjustContentInsets>
            <View style={invoiceStyles.container}>
                <View style={invoiceStyles.content}>
                    <View style={[invoiceStyles.title, isDark && invoiceStyles.titleDark]}>
                        <Text style={[invoiceStyles.titleText, styleTextDark]}>
                            {Translator.trans(/** @Desc("Successfully paid") */ 'success-paid', {}, 'mobile-native')}
                        </Text>
                    </View>
                    <View style={[invoiceStyles.row, isDark && invoiceStyles.rowDark]}>
                        <Text style={[invoiceStyles.text, styleTextDark]}>{product.desc}</Text>
                        <Text style={[invoiceStyles.text, invoiceStyles.boldText, styleTextDark]}>{product.priceWithoutDiscount}</Text>
                    </View>
                    {product.discount > 0 && (
                        <View style={[invoiceStyles.row, isDark && invoiceStyles.rowDark]}>
                            <Text style={styleDiscount}>{Translator.trans('discount')}</Text>
                            <Text style={styleDiscount}>{`-${product.discountAmount}`}</Text>
                        </View>
                    )}
                    <View style={[invoiceStyles.row, isDark && invoiceStyles.rowDark, {borderBottomWidth: 0, marginTop: 20}]}>
                        <Text style={[invoiceStyles.text, invoiceStyles.boldText, styleTextDark]}>{Translator.trans('total')}</Text>
                        <Text style={[invoiceStyles.text, invoiceStyles.bigText, styleTextDark]}>{product.price}</Text>
                    </View>
                </View>
                <SubmitButton theme={theme} color={submitButtonColor} onPress={onContinue} label={Translator.trans('continue')} raised />
            </View>
        </ScrollView>
    );
}, propsAreEqual);

PaymentInvoice.displayName = 'PaymentInvoice';
PaymentInvoice.propTypes = {
    theme: PropTypes.string,
    onContinue: PropTypes.func,
    product: PropTypes.shape({
        desc: PropTypes.string.isRequired,
        priceWithoutDiscount: PropTypes.string.isRequired,
        discountAmount: PropTypes.string,
        price: PropTypes.string.isRequired,
        discount: PropTypes.number,
    }),
    submitButtonColor: PropTypes.string,
    customStyles: PropTypes.any,
};
PaymentInvoice.defaultProps = {
    submitButtonColor: Colors.blueDark,
    onContinue: () => {},
};

export default withTheme(PaymentInvoice);

const styles = StyleSheet.create({
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
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
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginTop: 10,
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderBottomColor: '#bec2cc',
                borderBottomWidth: 2,
            },
            android: {
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
            },
        }),
    },
    titleDark: {
        ...Platform.select({
            ios: {
                borderBottomColor: DarkColors.border,
                borderBottomWidth: 1,
            },
        }),
    },
    titleText: {
        fontFamily: Fonts.regular,
        fontSize: 20,
        ...Platform.select({
            ios: {
                color: Colors.grayDark,
            },
            android: {
                color: Colors.gold,
            },
        }),
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                paddingVertical: 16,
                paddingHorizontal: 16,
            },
        }),
    },
    rowDark: {
        borderBottomColor: DarkColors.border,
    },
    text: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 15,
            },
            android: {
                fontSize: 16,
            },
        }),
    },
    redText: {
        color: Colors.red,
    },
    redTextDark: {
        color: DarkColors.red,
    },
    boldText: {
        fontFamily: Fonts.bold,
        ...Platform.select({
            ios: {
                fontWeight: 'bold',
            },
            android: {
                fontWeight: '500',
            },
        }),
    },
    bigText: {
        fontSize: 20,
    },
});
