import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {openExternalUrl} from '../../../helpers/navigation';
import Storage from '../../../storage';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedComponent} from '../../baseThemed';

@withTheme
class CardOffer extends BaseThemedComponent {
    static propTypes = {
        ...BaseThemedComponent.propTypes,
        navigation: PropTypes.object,
        index: PropTypes.number,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        link: PropTypes.object.isRequired,
    };

    static LAYOUT_HEIGHT = 60;

    constructor(props) {
        super(props);

        this.openOffer = this.openOffer.bind(this);
    }

    openDisclosure = () => {
        const {advertiserDisclosureLink} = Storage.getItem('profile');

        openExternalUrl({url: advertiserDisclosureLink, external: false});
    };

    openOffer() {
        const {
            link: {url},
        } = this.props;

        openExternalUrl({url, external: false});
    }

    render() {
        const {index, title, description, image, link} = this.props;
        const colors = this.themeColors;

        return (
            <View style={[styles.cardOffer, this.isDark && styles.cardOfferDark]}>
                {index === 0 && (
                    <TouchableOpacity onPress={this.openDisclosure}>
                        <Text style={[styles.cardOfferLink, this.isDark && {color: colors.text}]}>
                            {Translator.trans('advertiser.disclosure', {}, 'messages')}
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.cardOfferBlock} onPress={this.openOffer}>
                    <View style={styles.cardOfferDetails}>
                        {typeof title === 'string' && <Text style={[styles.cardOfferTitle, this.isDark && styles.textDark]}>{title}</Text>}
                        {typeof description === 'string' && (
                            <Text style={[styles.cardOfferCategory, this.isDark && {color: colors.text}]}>
                                {description + ' '}
                                <Text style={[styles.cardOfferBlueText, {color: colors.blue}]}>{link.title}</Text>
                            </Text>
                        )}
                    </View>
                    {typeof image === 'string' && image.length > 0 && (
                        <View style={[styles.cardOfferThumb, this.isDark && {borderColor: DarkColors.border}]}>
                            <Image
                                style={{
                                    height: 32,
                                    borderRadius: 2,
                                    resizeMode: 'contain',
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                                source={{uri: image}}
                            />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardOffer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingTop: 5,
        paddingLeft: 5,
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                paddingRight: 15,
            },
            android: {
                paddingRight: 16,
            },
        }),
    },
    cardOfferDark: {
        backgroundColor: DarkColors.bgLight,
    },
    cardOfferLink: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: '#8e9199',
    },
    cardOfferBlock: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    cardOfferDetails: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    cardOfferTitle: {
        fontSize: 12,
        lineHeight: 14,
        textAlign: 'right',
        fontFamily: Fonts.bold,
        ...Platform.select({
            ios: {
                fontWeight: 'bold',
                color: Colors.textGray,
            },
            android: {
                fontWeight: '500',
                color: Colors.grayDark,
            },
        }),
    },
    cardOfferBlueText: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    cardOfferCategory: {
        fontSize: 12,
        textAlign: 'right',
        lineHeight: 14,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    cardOfferThumb: {
        width: 50,
        height: 32,
        marginLeft: 10,
        // borderWidth: 1,
        overflow: 'hidden',
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

export default CardOffer;
