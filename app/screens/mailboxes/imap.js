import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import Form, {stylesMaker, SubmitButton} from '../../components/form';
import {isAndroid, isIOS} from '../../helpers/device';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {Mailbox} from './mailbox';
import {logMailboxConnectEvent} from './utils';

class MailboxIMAP extends Mailbox {
    static navigationOptions = () => ({
        title: Translator.trans('linking-mailbox', {}, 'mobile-native'),
    });

    form = React.createRef();

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.renderFooter = this.renderFooter.bind(this);

        const {route} = this.props;

        this.state = {
            fields: [
                {
                    type: 'email',
                    name: 'email',
                    required: true,
                    mapped: true,
                    label: Translator.trans('award.mailbox.th-email', {}, 'messages'),
                    value: route.params?.email,
                },
                {
                    type: 'password',
                    name: 'password',
                    required: true,
                    mapped: true,
                    label: Translator.trans('login.pass', {}, 'messages'),
                    value: null,
                },
            ],
        };
    }

    async onSubmit(fields) {
        const {route} = this.props;
        const owner = route.params?.owner;
        let success = false;

        this.setLoading(true);

        if (_.isObject(owner)) {
            fields.agentId = owner.value;
        }

        try {
            const response = await this.addMailbox(fields);
            const {data} = response;

            if (_.isObject(data)) {
                const {status, error} = data;

                if (error) {
                    if (this.form) {
                        this.form.setFieldError('email', error);
                    }
                }

                if (status === 'added') {
                    success = true;
                }
            }
        } finally {
            this.setLoading(false);
            if (success) {
                logMailboxConnectEvent(route, {type: 'imap'});
                this.navigate('Mailboxes');
            }
        }
    }

    onFormReady = (form) => {
        form.scrollToField('password', true);
    };

    setLoading(loading) {
        if (this.submitButton && this.mounted) {
            this.submitButton.setLoading(loading);
        }
    }

    renderFooter() {
        const {route, theme} = this.props;
        const isUpdate = route.params?.update ?? false;

        return (
            <SubmitButton
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={isAndroid ? this.selectColor(Colors.gold, DarkColors.gold) : this.selectColor(Colors.blueDark, DarkColors.blue)}
                label={isUpdate ? Translator.trans('update.button', {}, 'messages') : Translator.trans('button.add', {}, 'messages')}
                onPress={() => this.form.current?.submit()}
                raised
                theme={theme}
            />
        );
    }

    render() {
        const {fields} = this.state;

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <Form
                    ref={this.form}
                    fields={fields}
                    onSubmit={this.onSubmit}
                    onFormReady={this.onFormReady}
                    fieldsStyles={!isIOS ? stylesMaker(Colors.gold) : undefined}
                    footerComponent={this.renderFooter}
                    customStyle={{
                        container: {
                            base: {
                                ...Platform.select({
                                    ios: {
                                        backgroundColor: this.selectColor(Colors.bgGray, Colors.black),
                                    },
                                    android: {
                                        backgroundColor: Colors.white,
                                    },
                                }),
                            },
                        },
                    }}
                />
            </View>
        );
    }
}

export default withTheme(MailboxIMAP);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.bgGray,
            },
            android: {
                backgroundColor: Colors.white,
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
});
