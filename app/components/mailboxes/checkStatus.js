import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isTablet} from '../../helpers/device';
import {PathConfig} from '../../navigation/linking';
import {withNavigation} from '../../navigation/withNavigation';
import API from '../../services/api';
import {navigateByPath} from '../../services/navigator';
import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import {SubmitButton} from '../form';
// eslint-disable-next-line import/no-named-as-default
import Modal from '../page/modal';
import MailboxRow from './row';

const testID = 'mailbox-check-status';

class MailboxCheckStatus extends BaseThemedPureComponent {
    state = {
        mailbox: null,
    };

    // eslint-disable-next-line class-methods-use-this
    componentDidMount() {
        this.mounted = true;
        this.checkStatus();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    checkStatus = async () => {
        // debug url /mailbox/check-status/1
        const response = await API.get('/mailbox/check-status');

        if (_.isObject(response)) {
            const {data} = response;

            if (_.isArray(data)) {
                const [mailbox] = data;

                this.safeSetState({mailbox});
            }
        }
    };

    navigate = async () => {
        const {
            mailbox: {id: updateId},
        } = this.state;

        await this.close();

        navigateByPath(PathConfig.Mailboxes, {updateId});
    };

    close = () =>
        new Promise((resolve) => {
            this.safeSetState(
                {
                    mailbox: null,
                },
                resolve,
            );
        });

    render() {
        const {mailbox} = this.state;
        const {theme} = this.props;

        return (
            _.isObject(mailbox) && (
                <Modal
                    title={Translator.trans('mailbox_connection_lost_title', {}, 'messages')}
                    visible
                    transparent={false}
                    headerStyle={getDefaultNavigationOptions(theme, Colors.blueDark).headerStyle}
                    presentationStyle={isTablet ? 'formSheet' : 'fullScreen'}
                    animationType='slide'
                    onClose={this.close}>
                    <SafeAreaView style={[styles.page, styles.pageWhite, this.isDark && styles.pageDark]}>
                        <View style={styles.outer}>
                            <View style={styles.content}>
                                <View style={styles.header}>
                                    <Text style={[styles.text, this.isDark && styles.textDark]}>
                                        {Translator.trans(
                                            /** @Desc("We've lost the connection to your mailbox:") */ 'mailbox_lost_connection_popup.title',
                                            {},
                                            'mobile-native',
                                        )}
                                    </Text>
                                </View>
                                <View style={[styles.row, this.isDark && styles.rowDark]}>
                                    <MailboxRow owner={mailbox.owner} status={mailbox.status} email={mailbox.email} icon='icon-red-error' />
                                </View>
                                <View style={styles.header}>
                                    <Text style={[styles.text, this.isDark && styles.textDark]}>
                                        {Translator.trans(
                                            /** @Desc("Please re-authenticate your mailbox now.%br%Alternatively, if this mailbox no longer exists you can delete it from AwardWallet.") */ 'mailbox_lost_connection_popup',
                                            {br: '\n'},
                                            'mobile-native',
                                        )}
                                    </Text>
                                </View>
                            </View>
                            <SubmitButton
                                onPress={this.navigate}
                                label={Translator.trans('re_authenticate_mailbox', {}, 'messages')}
                                raised
                                color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                                theme={theme}
                            />
                        </View>
                    </SafeAreaView>
                </Modal>
            )
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
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
    pageWhite: {
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
    outer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    content: {
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    text: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Colors.textGray,
    },
    row: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    rowDark: {
        borderColor: DarkColors.border,
    },
});

const ThemedMailboxCheckStatus = withTheme(withNavigation(MailboxCheckStatus));
const ForwardRefComponent = React.forwardRef((props, ref) => <ThemedMailboxCheckStatus {...props} forwardedRef={ref} />);

ForwardRefComponent.displayName = 'ForwardRefMailboxCheckStatus';

export {ForwardRefComponent as MailboxCheckStatus};
