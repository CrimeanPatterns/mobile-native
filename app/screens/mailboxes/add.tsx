import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import Form, {IForm, stylesMaker, SubmitButton} from '../../components/form';
import AolButton, {signInAol} from '../../components/oauth/aol';
import GoogleButton, {signInGoogle} from '../../components/oauth/google';
import MicrosoftButton, {signInMicrosoft} from '../../components/oauth/microsoft';
import YahooButton, {signInYahoo} from '../../components/oauth/yahoo';
import Picker from '../../components/page/picker';
import {isAndroid, isIOS} from '../../helpers/device';
import {getMainColor} from '../../helpers/header';
import {Colors, DarkColors} from '../../styles';
import {useTheme} from '../../theme';
import {ProfileStackScreenFunctionalComponent} from '../../types/navigation';
import {Mailbox} from './mailbox';
import styles from './styles/add';
import {logMailboxConnectEvent} from './utils';

const customStyle = {
    container: {
        base: {
            backgroundColor: isIOS ? Colors.bgGray : Colors.white,
        },
    },
};

const MAILBOXES = {
    google: signInGoogle,
    microsoft: signInMicrosoft,
    yahoo: signInYahoo,
    aol: signInAol,
};

class MailboxAdd extends Mailbox {
    private onOwnerSelectedCb: ((value: any, index?: any) => void) | undefined;

    private state: {owners: any[]; fields: any[]};

    private form = React.createRef<IForm>();

    private mounted = false;

    static getDerivedStateFromProps(nextProps) {
        const {route, owners, source} = nextProps;

        return {
            fields: [
                {
                    type: 'email',
                    name: 'email',
                    required: true,
                    mapped: true,
                    label: Translator.trans('award.mailbox.th-email', {}, 'messages'),
                    value: null,
                },
            ],
            owners: route?.params?.owners ?? owners,
            source: route?.params?.source ?? source,
        };
    }

    _ownerPicker = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            fields: [],
            owners: [],
        };

        this.onFormReady = this.onFormReady.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onOwnerSelected = this.onOwnerSelected.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
        this.onOwnerSelectedCb = undefined;
    }

    get ownerPicker() {
        return this._ownerPicker.current;
    }

    onFormReady(form: IForm) {
        const {route} = this.props;
        const email = route.params?.email;

        console.log(form);
        if (email && form) {
            form.scrollToField('email', true);
        }
    }

    navigate(routeName, params) {
        const {navigation} = this.props;

        navigation.navigate(routeName, params);
    }

    onSubmit(fields) {
        const {email} = fields;

        if (!_.isEmpty(email)) {
            this.setLoading(true);
            this.addMailbox(fields)
                .then((response) => {
                    this.setLoading(false);
                    this.processResponse({response, email});
                })
                .catch(() => {
                    this.setLoading(false);
                });
        }
    }

    async processResponse({response, email}) {
        const {data} = response;

        if (_.isObject(data)) {
            const {type, status, error} = data;

            if (error) {
                this.form.current?.setFieldError('email', error);
            } else {
                if (MAILBOXES[type]) {
                    await this.signIn(type, {loginHint: email});
                }

                if (status === 'ask_password') {
                    const owner = await this.chooseOwner();

                    this.navigate('MailboxIMAP', {email, owner});
                }
            }
        }
    }

    setLoading(loading) {
        if (this.submitButton && this.mounted) {
            this.submitButton.setLoading(loading);
        }
    }

    async signIn(provider, config) {
        const {route, source} = this.props;
        const signInProvider = MAILBOXES[provider];

        try {
            const owner = await this.chooseOwner();

            this.setLoading(true);

            const data = await signInProvider(config);

            if (_.isObject(owner) && owner.value !== '') {
                data.agentId = owner.value;
            }

            await this.addMailbox(data);

            logMailboxConnectEvent(route, {type: provider, source});

            this.reload();
        } finally {
            this.setLoading(false);
        }
    }

    signInGoogle = () => this.signIn('google');

    signInMicrosoft = () => this.signIn('microsoft');

    signInYahoo = () => this.signIn('yahoo');

    signInAol = () => this.signIn('aol');

    chooseOwner() {
        const {owners} = this.state;

        return new Promise((resolve) => {
            if (_.isEmpty(owners) === false && owners.length > 1) {
                this.ownerPicker.show();
                this.onOwnerSelectedCb = resolve;
            } else {
                resolve(owners[0]);
            }
        });
    }

    onOwnerSelected(__, index) {
        const {owners} = this.state;

        if (_.isFunction(this.onOwnerSelectedCb)) {
            // @ts-ignore
            this.onOwnerSelectedCb(owners[index]);
        }
    }

    submit = () => this.form.current?.submit();

    get mainColor() {
        return getMainColor(this.selectColor(Colors.gold, DarkColors.gold), this.isDark);
    }

    get headerText() {
        return [
            Translator.trans(
                /** @Desc("Please link your mailbox to your AwardWallet account so that we can do all the work for you! Specifically, we will scan you mailbox for the loyalty programs you participate in and will add them to your profile automatically.") */ 'mailboxes.intro.1',
                {},
                'mobile-native',
            ),
            ' ',
            Translator.trans(
                /** @Desc("If we find upcoming travel plans in your inbox we will also have them imported into AwardWallet. This is the easiest way to get set up with AwardWallet. We will not be gathering any of your contacts or sending any of them any emails. This step is needed only to get your AwardWallet account set up.") */ 'mailboxes.intro.2',
                {},
                'mobile-native',
            ),
        ];
    }

    get containerStyle() {
        return [styles.page, this.isDark && styles.pageDark];
    }

    renderHeaderText() {
        const {route} = this.props;
        const showNotice = route.params?.showNotice ?? true;

        if (showNotice === true) {
            return (
                <View style={[styles.container, this.isDark && styles.containerDark]}>
                    <Text style={[styles.text, this.isDark && styles.textDark]}>{this.headerText}</Text>
                </View>
            );
        }

        return null;
    }

    renderHeader() {
        return (
            <>
                {this.renderHeaderText()}
                <View style={styles.buttonsWrap}>
                    <View style={styles.buttonContainer}>
                        <GoogleButton onPress={this.signInGoogle} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <MicrosoftButton onPress={this.signInMicrosoft} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <YahooButton onPress={this.signInYahoo} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <AolButton onPress={this.signInAol} />
                    </View>
                </View>
                <View style={[styles.or]}>
                    <View style={[styles.orSeparator, this.isDark && styles.orSeparatorDark]} />
                    <Text style={[styles.text, styles.orText, this.isDark && styles.orTextDark]}>
                        {Translator.trans('menu.invite.invite-link-or', {}, 'menu').toUpperCase()}
                    </Text>
                </View>
            </>
        );
    }

    renderFooter() {
        const {theme} = this.props;

        return (
            <SubmitButton
                theme={theme}
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={isAndroid ? this.mainColor : this.selectColor(Colors.blueDark, DarkColors.blue)}
                customStyle={{
                    label: {
                        base: {
                            color: this.selectColor(Colors.white, Colors.black),
                        },
                    },
                }}
                label={Translator.trans('button.add', {}, 'messages')}
                onPress={this.submit}
                raised
            />
        );
    }

    renderOwnerPicker() {
        const {owners} = this.state;

        if (_.isArray(owners)) {
            return (
                <Picker
                    ref={this._ownerPicker}
                    value={null}
                    title={Translator.trans('mailboxes.select-owner')}
                    items={owners.map((owner) => owner.name)}
                    onValueChange={this.onOwnerSelected}
                    cancelButton={Translator.trans('alerts.btn.cancel')}
                    confirmButton={Translator.trans('card-pictures.label.confirm')}
                    buttonUnderlayColor={Colors.grayLight}
                />
            );
        }

        return null;
    }

    renderForm() {
        const {fields} = this.state;

        return (
            <Form
                ref={this.form}
                style={this.containerStyle}
                fields={fields}
                onSubmit={this.onSubmit}
                headerComponent={this.renderHeader}
                footerComponent={this.renderFooter}
                fieldsStyles={isAndroid ? stylesMaker(this.mainColor) : undefined}
                customStyle={customStyle}
                onFormReady={this.onFormReady}
            />
        );
    }

    render() {
        return (
            <View style={this.containerStyle}>
                {this.renderOwnerPicker()}
                {this.renderForm()}
            </View>
        );
    }
}

export const MailboxAddScreen: ProfileStackScreenFunctionalComponent<'MailboxAdd'> = ({navigation, route}) => {
    const theme = useTheme();

    return <MailboxAdd theme={theme} navigation={navigation} route={route} />;
};

MailboxAddScreen.navigationOptions = () => ({
    title: Translator.trans(/** @Desc("Linking Your Mailbox") */ 'linking-mailbox', {}, 'mobile-native'),
});

export {MailboxAdd};
