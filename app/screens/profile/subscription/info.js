import React from 'react';
import {Platform, ScrollView, StyleSheet, Text} from 'react-native';
import HTML from 'react-native-render-html';

import {BaseThemedPureComponent} from '../../../components/baseThemed';
import {getMainColor} from '../../../helpers/header';
import NavigatorService from '../../../services/navigator';
import Storage from '../../../storage';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';

class BaseSubscriptionInfo extends BaseThemedPureComponent {
    static navigationOptions = {
        title: '',
    };

    constructor(props) {
        super(props);

        const {products} = Storage.getItem('profile');

        this.state = {
            message: products[0].description,
        };
    }

    get mainColor() {
        return getMainColor(Colors.gold, this.isDark);
    }

    onLinkPress = (evt, href) => {
        if (href === '#/terms') {
            NavigatorService.navigate('Terms');
        }

        if (href === '#/privacy') {
            NavigatorService.navigate('PrivacyNotice');
        }
    };

    getMessage() {
        const {message} = this.state;

        return message;
    }

    renderMessage = () => {
        const message = this.getMessage();
        const textColor = this.selectColor(Colors.grayDark, Colors.white);

        return (
            <HTML
                tagsStyles={{
                    p: {
                        paddingHorizontal: 10,
                        paddingBottom: 10,
                        color: textColor,
                        fontSize: 14,
                        fontFamily: Fonts.regular,
                    },
                    ul: {
                        paddingHorizontal: 5,
                        marginBottom: 0,
                    },
                    a: {
                        color: this.selectColor(Colors.blue, DarkColors.blue),
                    },
                    rawtext: {
                        color: textColor,
                    },
                }}
                baseFontStyle={{
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                }}
                defaultTextProps={{
                    selectable: false,
                }}
                source={{html: message}}
                listsPrefixesRenderers={{
                    ul: () => <Text style={{color: textColor, fontSize: 16, marginRight: 10}}>-</Text>,
                    ol: (_attrs, _node, _style, {nodeIndex}) => (
                        <Text style={{color: textColor, fontSize: 14, fontFamily: Fonts.regular}}>{`${nodeIndex}. `}</Text>
                    ),
                }}
                onLinkPress={this.onLinkPress}
            />
        );
    };

    render() {
        return (
            <ScrollView style={[styles.page, this.isDark && styles.pageDark]} contentContainerStyle={styles.contentContainer}>
                {this.renderMessage()}
            </ScrollView>
        );
    }
}

export default withTheme(BaseSubscriptionInfo);
export {BaseSubscriptionInfo as SubscriptionInfo};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
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
    contentContainer: {
        paddingVertical: 10,
    },
});
