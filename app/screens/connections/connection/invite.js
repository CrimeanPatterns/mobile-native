import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import HTML from 'react-native-render-html';

import {Button} from '../../../components/form';
import {HeaderLeftButton} from '../../../components/page/header/button';
import ConnectionsAPI from '../../../services/http/connections';
import Session from '../../../services/session';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseConnection} from './index';

class ConnectionInvite extends BaseConnection {
    static navigationOptions = ({navigation}) => ({
        presentation: 'transparentModal',
        title: '',
        headerLeft: () => <HeaderLeftButton onPress={navigation.goBack} iconName='android-clear' />,
    });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            avatar: null,
            inviterName: null,
            name: null,
            expired: false,
        };
    }

    async componentDidMount() {
        this.mounted = true;

        try {
            await this.getInviteInfo();
        } catch {
            this.close(false);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    get authorized() {
        return Session.authorized();
    }

    getShareCode = () => {
        const {route} = this.props;

        return route.params?.shareCode ?? null;
    };

    getInviteInfo = async () => {
        const shareCode = this.getShareCode();

        this.setLoading(true);

        if (_.isString(shareCode)) {
            const response = await ConnectionsAPI.getInviteInfo(shareCode);

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data)) {
                    const {expired, avatar, inviterName, name} = data;

                    this.safeSetState({
                        expired,
                        avatar,
                        inviterName,
                        name,
                    });
                }
            }
        }

        this.setLoading(false);
    };

    setLoading = (loading) => {
        this.safeSetState({loading});
    };

    close = (reload = true, success = false) => {
        const {navigation} = this.props;

        navigation.goBack(); // needed to dismiss modal

        if (this.authorized) {
            navigation.navigate('Connections', {reload});
        } else {
            navigation.navigate(success ? 'SignUp' : 'SignIn');
        }
    };

    acceptInvite = async (buttonRef) => {
        const shareCode = this.getShareCode();

        buttonRef.setLoading(true);

        await ConnectionsAPI.acceptInvite(shareCode);

        buttonRef.setLoading(false);
    };

    register = async () => {
        await this.acceptInvite(this.buttonRegister);

        this.close(false, true);
    };

    connect = async () => {
        await this.acceptInvite(this.buttonConnect);

        this.close();
    };

    reject = async () => {
        const shareCode = this.getShareCode();

        this.buttonReject.setLoading(true);

        await ConnectionsAPI.rejectInvite(shareCode);

        this.buttonReject.setLoading(false);

        this.close();
    };

    renderCaption = () => {
        const {theme} = this.props;
        const html = `
            <p>${this.getGreeting()}</p>
            <p>${this.getContentText()}</p>
        `;

        return (
            <HTML
                key={`html_${theme}`}
                tagsStyles={{
                    strong: {
                        fontFamily: Fonts.bold,
                        fontWeight: 'bold',
                    },
                    p: {
                        marginVertical: 5,
                    },
                }}
                baseFontStyle={{...styles.text, ...(this.isDark && styles.textDark)}}
                defaultTextProps={{
                    selectable: false,
                }}
                source={{html}}
            />
        );
    };

    getContentText = () => {
        const {inviterName, expired} = this.state;
        const properties = {bold_on: '<strong>', bold_off: '</strong>', br: '<br/>', name: inviterName};

        if (expired) {
            return Translator.trans('invitation.expired', properties);
        }

        if (!this.authorized) {
            return Translator.trans('invite.to.register', properties);
        }

        return Translator.trans('invite.to.connect', properties);
    };

    getGreeting = () => {
        const {name = ''} = this.state;
        const parameters = {bold_on: '', bold_off: '', name};

        if (_.isEmpty(name) === false) {
            parameters.bold_on = '<strong>';
            parameters.bold_off = '<strong>';
        }

        return Translator.trans('greeting', parameters);
    };

    renderButtonRegister = () => {
        const {whiteStyle} = this.getButtonStyles();

        return (
            <View style={styles.buttonWrap}>
                <Button
                    ref={(ref) => {
                        this.buttonRegister = ref;
                    }}
                    onPress={this.register}
                    label={Translator.trans('invitation.accept', {}, 'messages')}
                    raised
                    mode='outlined'
                    customStyle={whiteStyle}
                    pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                />
            </View>
        );
    };

    renderButtonConnect = () => {
        const {inviterName} = this.state;
        const {blueStyle} = this.getButtonStyles();

        return (
            <View style={styles.buttonWrap}>
                <Button
                    ref={(ref) => {
                        this.buttonConnect = ref;
                    }}
                    onPress={this.connect}
                    label={Translator.trans('connect.with.person', {name: inviterName})}
                    raised
                    mode='outlined'
                    customStyle={blueStyle}
                    pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                />
            </View>
        );
    };

    renderButtonReject = () => {
        const {whiteStyle} = this.getButtonStyles();

        return (
            <View style={styles.buttonWrap}>
                <Button
                    ref={(ref) => {
                        this.buttonReject = ref;
                    }}
                    onPress={this.reject}
                    label={Translator.trans('connection.reject')}
                    raised
                    mode='outlined'
                    customStyle={whiteStyle}
                    pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                />
            </View>
        );
    };

    renderButtons = () => {
        if (!this.authorized) {
            return this.renderButtonRegister();
        }

        return (
            <View style={styles.buttonContainer}>
                {this.renderButtonConnect()}
                {this.renderButtonReject()}
            </View>
        );
    };

    renderContent = () => {
        const {loading} = this.state;

        if (loading) {
            return this.renderSpinner();
        }

        return (
            <>
                <ScrollView alwaysBounceVertical={false} automaticallyAdjustContentInsets contentInsetAdjustmentBehavior='automatic'>
                    {this.renderCaption()}
                </ScrollView>
                {this.renderButtons()}
            </>
        );
    };

    render() {
        return <View style={[styles.container, this.isDark && styles.containerDark]}>{this.renderContent()}</View>;
    }
}

export default withTheme(ConnectionInvite);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        backgroundColor: '#f3f4f5',
        paddingVertical: 50,
        paddingHorizontal: 35,
    },
    containerDark: {
        backgroundColor: Colors.black,
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
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
    buttonContainer: {
        bottom: 0,
    },
    buttonWrap: {
        marginVertical: 10,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
});
