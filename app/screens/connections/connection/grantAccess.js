import Translator from 'bazinga-translator';
import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import HTML from 'react-native-render-html';

import {Button} from '../../../components/form';
import {HeaderLeftButton} from '../../../components/page/header/button';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseConnection} from './index';

class ConnectionGrantAccess extends BaseConnection {
    static navigationOptions = ({navigation}) => ({
        presentation: 'transparentModal',
        title: Translator.trans('please-choose'),
        headerLeft: () => <HeaderLeftButton onPress={navigation.goBack} iconName='android-clear' />,
    });

    constructor(props) {
        super(props);

        this.buttonNothing = null;
    }

    close = () => {
        const {navigation} = this.props;

        navigation.goBack();
    };

    readOnly = async () => {
        const connection = this.getConnection();

        this.shareReadOnly(connection);
    };

    fullAccess = async () => {
        const connection = this.getConnection();

        this.shareFullAccess(connection);
    };

    doNothing = async () => {
        const {navigation} = this.props;
        const connection = this.getConnection();

        this.buttonNothing.setLoading(true);

        try {
            await this.shareNeverShow(connection);
            navigation.goBack();
        } finally {
            this.buttonNothing.setLoading(false);
        }
    };

    renderCaption() {
        const {theme} = this.props;
        const {name} = this.getConnection();

        return (
            <HTML
                key={`html_${theme}`}
                tagsStyles={{
                    strong: {
                        fontFamily: Fonts.bold,
                        fontWeight: 'bold',
                    },
                }}
                baseFontStyle={{...styles.text, ...(this.isDark && styles.textDark)}}
                defaultTextProps={{
                    selectable: false,
                }}
                source={{html: Translator.trans('after.share.accounts.modal.content', {agent_fullname: `<strong>${name}</strong>`})}}
            />
        );
    }

    renderButtonCaption = (caption) => <Text style={[styles.buttonInfo, this.isDark && styles.textDark]}>{caption}</Text>;

    renderButtonNothing = () => {
        const {theme} = this.props;
        const {whiteStyle} = this.getButtonStyles();

        return (
            <View style={styles.buttonWrap}>
                <Button
                    ref={(ref) => {
                        this.buttonNothing = ref;
                    }}
                    onPress={this.doNothing}
                    label={Translator.trans(/** @Desc("Nothing") */ 'nothing', {}, 'mobile-native')}
                    raised
                    customStyle={whiteStyle}
                    mode='outlined'
                    pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                    theme={theme}
                />
                {this.renderButtonCaption(Translator.trans('give.access.choose-later'))}
            </View>
        );
    };

    renderButtonReadOnly() {
        const {theme} = this.props;
        const {name} = this.getConnection();
        const {whiteStyle} = this.getButtonStyles();

        return (
            <View style={styles.buttonWrap}>
                <Button
                    onPress={this.readOnly}
                    label={Translator.trans(/** @Desc("Read-only") */ 'read-only', {}, 'mobile-native')}
                    raised
                    customStyle={whiteStyle}
                    mode='outlined'
                    pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                    theme={theme}
                />
                {this.renderButtonCaption(Translator.trans('give.read-only.access.to', {agent_fullname: name}))}
            </View>
        );
    }

    renderButtonFullAccess() {
        const {theme} = this.props;
        const {name} = this.getConnection();
        const {blueStyle} = this.getButtonStyles();

        return (
            <View style={styles.buttonWrap}>
                <Button
                    onPress={this.fullAccess}
                    label={Translator.trans(/** @Desc("Full Control") */ 'full-control', {}, 'mobile-native')}
                    raised
                    mode='outlined'
                    customStyle={blueStyle}
                    theme={theme}
                />
                {this.renderButtonCaption(Translator.trans('give.full.access.to', {agent_fullname: name}))}
            </View>
        );
    }

    render() {
        return (
            <ScrollView
                alwaysBounceVertical={false}
                automaticallyAdjustContentInsets
                contentInsetAdjustmentBehavior='automatic'
                style={[styles.container, this.isDark && styles.containerDark]}>
                {this.renderCaption()}
                {this.renderButtonNothing()}
                {this.renderButtonReadOnly()}
                {this.renderButtonFullAccess()}
            </ScrollView>
        );
    }
}

export default withTheme(ConnectionGrantAccess);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        backgroundColor: Colors.bgGray,
        ...Platform.select({
            ios: {
                padding: 50,
            },
            android: {
                paddingVertical: 50,
                paddingHorizontal: 35,
            },
        }),
    },
    containerDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    text: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 17,
                color: '#898f99',
                lineHeight: 24,
            },
            android: {
                fontSize: 14,
                color: Colors.grayDarkLight,
                lineHeight: 20,
            },
        }),
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
    buttonWrap: {
        marginTop: 40,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    buttonInfo: {
        fontFamily: Fonts.regular,
        paddingTop: 8,
        paddingHorizontal: 5,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                fontSize: 12,
                color: Colors.grayDark,
            },
            android: {
                fontSize: 14,
                color: '#9e9e9e',
            },
        }),
    },
});
