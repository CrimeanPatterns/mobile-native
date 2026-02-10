import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Polygon, Svg} from 'react-native-svg';

import {isTablet} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {Button} from '../../form';
import Message from './message';

const Triangle = () => (
    <Svg height={7} width={14} fill={Colors.white} viewBox='0 0 100 50'>
        <Polygon points='0,0 100,0 50,50' fill={Colors.white} />
    </Svg>
);
const images = {
    unpaid: require('../../../assets/images/unpaid.png'),
    unpaidDark: require('../../../assets/images/unpaid-dark.png'),
    paid: require('../../../assets/images/paid.png'),
    paidDark: require('../../../assets/images/paid-dark.png'),
};

@withTheme
class Invoice extends Message {
    static propTypes = {
        ...Message.propTypes,
        intro: PropTypes.string.isRequired,
        bookerLogoSrc: PropTypes.string.isRequired,
        bookerAddress: PropTypes.string.isRequired,
        bookerEmail: PropTypes.string.isRequired,
        header: PropTypes.array.isRequired,
        items: PropTypes.array.isRequired,
        miles: PropTypes.array,
        totalLabel: PropTypes.string.isRequired,
        total: PropTypes.string.isRequired,
        isPaid: PropTypes.bool.isRequired,
        footer: PropTypes.string.isRequired,
        proceedButton: PropTypes.string,
        proceedButtonUrl: PropTypes.string,
    };

    static defaultProps = {
        ...Message.defaultProps,
    };

    constructor(props) {
        super(props);

        this.onPressProceedButton = this.onPressProceedButton.bind(this);
    }

    mailTo = (email) => Linking.openURL(`mailto:${email}`);

    onPressProceedButton() {
        const {proceedButtonUrl} = this.props;

        this.openExternalUrl(proceedButtonUrl);
    }

    renderInvoiceHeader() {
        const {bookerLogoSrc, bookerEmail, bookerAddress} = this.props;

        return (
            <View style={styles.invoiceTop}>
                {_.isString(bookerLogoSrc) && <Image style={styles.invoiceLogo} source={{uri: bookerLogoSrc}} />}
                {_.isString(bookerAddress) && this.renderAsNative(bookerAddress, {fontStyle: styles.text})}
                {_.isString(bookerEmail) && (
                    <TouchableOpacity onPress={() => this.mailTo(bookerEmail)}>
                        <Text style={[styles.text, styles.link]}>{bookerEmail}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    renderTableHeader() {
        const {header} = this.props;

        if (_.isArray(header)) {
            return <View style={styles.table}>{header.map(this.renderTableRow)}</View>;
        }

        return null;
    }

    renderTableRow = ({name, value, type, discount, total}, index, header) => (
        <React.Fragment key={`header_row_${index}`}>
            <View style={[styles.tableRow, isTablet && styles.tableRowTablet]}>
                <View style={[styles.tableCell, styles.tableCaptionCell]}>
                    <Text style={styles.caption}>{name}</Text>
                </View>
                {type === 'billTo' && (
                    <View style={[styles.tableCell, styles.tableInfoCell]}>
                        {_.isString(value.contactName) && <Text style={[styles.text, styles.info]}>{value.contactName}</Text>}
                        {_.isString(value.contactPhone) && <Text style={[styles.text, styles.info]}>{value.contactPhone}</Text>}
                        {_.isString(value.contactEmail) && (
                            <TouchableOpacity onPress={() => this.mailTo(value.contactEmail)}>
                                <Text style={[styles.text, styles.info, styles.link]}>{value.contactEmail}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                {_.isEmpty(type) && (
                    <View style={[styles.tableCell, styles.tableInfoCell]}>
                        <Text style={[styles.text, styles.info]}>
                            {value}
                            {_.isString(discount) && <Text style={[styles.bold, styles.red]}>{`- ${discount}`}</Text>}
                            {_.isString(total) && <Text>{`= ${total}`}</Text>}
                        </Text>
                    </View>
                )}
            </View>
            {index !== header.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
    );

    renderInvoiceFooter = () => {
        const arr = new Array(28).fill(null);

        return (
            <View style={styles.triangleWrap}>
                {arr.map((item, index) => (
                    <Triangle key={`triangle_${index}`} />
                ))}
            </View>
        );
    };

    renderTable() {
        const {items} = this.props;

        if (_.isArray(items)) {
            return items.map((section, index) => {
                const {description, quantity, rate, amount} = section;
                const rows = [quantity, rate, amount];

                return (
                    <View style={styles.table} key={`section_${index}`}>
                        <View style={styles.tableCell}>
                            <Text style={[styles.text, styles.bold, styles.big]}>{description}</Text>
                        </View>
                        <View style={styles.separator} />
                        {rows.map(this.renderTableRow)}
                    </View>
                );
            });
        }

        return null;
    }

    renderTableTotal() {
        const {total, totalLabel} = this.props;

        return (
            <View style={styles.table}>
                <View style={[styles.tableRow, isTablet && styles.tableRowTablet]}>
                    <View style={[styles.tableCell, styles.tableCaptionCell]}>
                        <Text style={styles.caption}>{totalLabel}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.tableInfoCell]}>
                        <Text style={[styles.text, styles.info, styles.red, styles.bold, styles.big]}>{total}</Text>
                    </View>
                </View>
            </View>
        );
    }

    renderMessage() {
        const {intro, footer, isPaid} = this.props;

        return (
            <View style={[styles.message, isTablet && styles.messageTablet]}>
                <View style={styles.intro}>{this.renderAsNative(intro)}</View>
                <View style={[styles.invoiceWrap, isTablet && styles.invoiceWrapTablet]}>
                    <View style={[styles.invoice, isTablet && styles.invoiceTablet]}>
                        {this.renderInvoiceHeader()}
                        <View style={styles.tableWrap}>
                            {this.renderTableHeader()}
                            {this.renderTable()}
                            {this.renderTableTotal()}
                        </View>
                    </View>
                </View>
                <View style={styles.invoiceStatus}>
                    {!isPaid && <Image source={this.selectColor(images.unpaid, images.unpaidDark)} style={styles.unpaidInvoice} />}
                    {isPaid && <Image source={this.selectColor(images.paid, images.paidDark)} style={styles.paidInvoice} />}
                </View>
                <View style={styles.footer}>{this.renderAsNative(footer)}</View>
            </View>
        );
    }

    renderFooterButton() {
        const {isPaid, proceedButton, theme} = this.props;

        return (
            !isPaid && (
                <Button
                    theme={theme}
                    color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                    label={proceedButton}
                    onPress={this.onPressProceedButton}
                />
            )
        );
    }
}

export default Invoice;
const styles = StyleSheet.create({
    message: {},
    messageTablet: {},
    invoice: {
        backgroundColor: Colors.white,
        elevation: 2,
        marginTop: 10,
        marginBottom: 20,
        padding: 10,
    },
    invoiceTablet: {
        paddingHorizontal: 0,
        width: '70%',
    },
    invoiceWrapTablet: {
        alignItems: 'center',
    },
    invoiceTop: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    invoiceLogo: {
        width: 260,
        height: 70,
        marginVertical: 10,
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.grayDark,
        lineHeight: 17,
        textAlign: 'center',
    },
    link: {
        color: Colors.blue,
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    bold: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    red: {
        color: Colors.red,
    },
    big: {
        fontSize: 17,
    },
    tableWrap: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        marginTop: 10,
    },
    table: {
        borderTopWidth: 2,
        borderTopColor: Colors.gray,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    tableRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    tableRowTablet: {
        paddingHorizontal: '10%',
    },
    tableCell: {
        paddingVertical: 5,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    tableCaptionCell: {
        width: 100,
        paddingTop: 6,
    },
    tableInfoCell: {
        flex: 1,
    },
    caption: {
        fontSize: 11,
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
    },
    info: {
        fontSize: 14,
        textAlign: 'left',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
    },
    triangleWrap: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        position: 'absolute',
        bottom: -6,
        left: -1,
        right: 0,
        zIndex: 2,
    },
    paidInvoice: {
        width: 126,
        height: 60,
        marginBottom: 20,
    },
    unpaidInvoice: {
        width: 153,
        height: 44,
        marginBottom: 20,
    },
});
