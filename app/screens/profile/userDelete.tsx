import Icon from '@components/icon';
import BusinessWarningBottomSheet from '@components/profile/bottomSheet/businessWarning';
import ConfirmBottomSheet from '@components/profile/bottomSheet/confirm';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {StackNavigationProp} from '@react-navigation/stack';
import axios, {CancelTokenSource} from 'axios';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Alert, Keyboard, StyleSheet, Text, View} from 'react-native';
import HTML from 'react-native-render-html';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Form, {FormProps, IForm, stylesMaker, SubmitButton} from '../../components/form';
import {isAndroid, isIOS} from '../../helpers/device';
import API from '../../services/api';
import EventEmitter from '../../services/eventEmitter';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useTheme} from '../../theme';
import {ProfileStackParamList, ProfileStackScreenFunctionalComponent} from '../../types/navigation';

class UserDelete extends BaseThemedPureComponent<
    {
        navigation: StackNavigationProp<ProfileStackParamList, 'UserDelete'>;
    },
    {
        fields: FormProps['fields'];
        errors: string[];
        companyName: string | undefined;
    }
> {
    private cancelToken: CancelTokenSource | undefined;

    private mounted = false;

    private submitButtonRef = React.createRef<SubmitButton>();

    private formRef = React.createRef<IForm>();

    private confirmBottomSheetRef = React.createRef<BottomSheetModal>();

    private businessWarningBottomSheetRef = React.createRef<BottomSheetModal>();

    constructor(props) {
        super(props);

        this.state = {
            fields: [
                {
                    value: '',
                    name: 'reason',
                    label: Translator.trans(/** @Desc("Please Enter Your Feedback") */ 'user.delete.enter.feedback', {}, 'mobile-native'),
                    required: true,
                    type: 'textarea',
                },
            ],
            errors: [],
            companyName: '',
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.cancelToken = axios.CancelToken.source();
        this.mounted = true;
    }

    componentWillUnmount() {
        if (this.cancelToken) {
            this.cancelToken.cancel();
        }
        this.mounted = false;
    }

    setLoading(loading) {
        if (this.submitButtonRef) {
            this.submitButtonRef.current.setLoading(loading);
        }
    }

    onSubmit() {
        Keyboard.dismiss();
        this.confirmBottomSheetRef.current?.present();
    }

    async remove() {
        this.setLoading(true);

        const reason = this.formRef.current?.getValue('reason');
        const errors: string[] = [];

        try {
            const {data} = await API.post<{
                success?: boolean;
                unlinkFromBusiness?: boolean;
                companyName?: string;
                error?: string;
                reasonError?: string;
            }>('/user/delete', {reason}, {cancelToken: this.cancelToken?.token});

            if (_.isObject(data)) {
                const {success, unlinkFromBusiness, companyName, error, reasonError} = data;

                if (success) {
                    EventEmitter.emit('doLogout');
                    setTimeout(() => Alert.alert('', Translator.trans('user.delete.deleted')), 150);
                    return;
                }

                if (unlinkFromBusiness) {
                    this.setState({companyName});
                    this.businessWarningBottomSheetRef.current?.present();
                } else {
                    if (error) {
                        errors.push(error);
                    }

                    if (reasonError) {
                        this.formRef.current?.setFieldError('reason', reasonError);
                    }
                }
            }
        } finally {
            if (this.mounted) {
                this.setLoading(false);
                this.setState({
                    errors,
                });
            }
        }
    }

    renderInfoBlock = (icon, iconSize, title, content) => {
        const html = `<p><b>${title.toUpperCase()}</b> ${content}</p>`;

        return (
            <View style={styles.infoWrap}>
                <View style={[styles.iconWrap, this.isDark && styles.iconWrapDark]}>
                    <Icon name={icon} size={iconSize} color={this.selectColor(isIOS ? Colors.textGray : Colors.grayDark, Colors.white)} />
                </View>
                <HTML
                    tagsStyles={{p: {marginVertical: 0}}}
                    source={{html}}
                    containerStyle={{flex: 1}}
                    baseFontStyle={{...styles.middleText, ...styles.infoBlockText, ...(this.isDark && styles.textDark)}}
                />
            </View>
        );
    };

    renderHeader = () => {
        const {navigation} = this.props;
        const html = `<p>${Translator.trans(
            'user.delete.info3',
            {
                link_on: '<a href="javascript: void(0)">',
                link_off: '</a>',
            },
            'messages',
        )}</p>`;

        return (
            <View style={styles.header}>
                <Text style={[styles.title, this.isDark && styles.titleDark]}>{Translator.trans('user.delete.title', {}, 'messages')}</Text>
                <Text style={[styles.subTitle, styles.text, this.isDark && styles.textDark]}>
                    {Translator.trans('user.delete.info1', {}, 'messages')}
                </Text>
                <HTML
                    tagsStyles={{
                        p: {
                            marginVertical: 0,
                        },
                        a: {
                            color: this.selectColor(Colors.grayDark, Colors.white),
                            textDecorationLine: 'underline',
                        },
                    }}
                    baseFontStyle={{...styles.middleText, ...styles.text, ...(this.isDark && styles.textDark)}}
                    source={{html}}
                    onLinkPress={() => navigation.navigate('ContactUs')}
                />
                <View style={styles.infoBlockWrap}>
                    {this.renderInfoBlock(
                        'footer-delete',
                        18,
                        Translator.trans('user.delete.term.title1', {}, 'messages'),
                        Translator.trans('user.delete.term1', {}, 'messages'),
                    )}
                    {this.renderInfoBlock(
                        'menu-terms-new',
                        16,
                        Translator.trans('user.delete.term.title2', {}, 'messages'),
                        Translator.trans('user.delete.term2', {}, 'messages'),
                    )}
                    {this.renderInfoBlock(
                        'hours',
                        16,
                        Translator.trans('user.delete.term.title3', {}, 'messages'),
                        Translator.trans('user.delete.term3', {}, 'messages'),
                    )}
                </View>
            </View>
        );
    };

    renderFooter = () => {
        const {theme} = this.props;

        return (
            <>
                <SubmitButton
                    ref={this.submitButtonRef}
                    pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                    customStyle={{
                        buttonView: {
                            base: styles.buttonViewBase,
                        },
                        button: {
                            base: {
                                backgroundColor: this.selectColor(Colors.white, DarkColors.bgLight),
                                borderColor: this.selectColor(Colors.gray, DarkColors.border),
                                ...styles.buttonBase,
                            },
                            disabled: {
                                backgroundColor: this.selectColor(Colors.grayLight, DarkColors.bg),
                            },
                            loading: {
                                backgroundColor: this.selectColor(Colors.grayLight, DarkColors.bg),
                            },
                        },
                        label: {
                            base: {
                                color: this.selectColor(Colors.grayDark, Colors.white),
                                ...styles.labelBase,
                            },
                            pressed: {
                                color: this.selectColor(Colors.grayDark, Colors.white),
                            },
                            disabled: {
                                color: this.selectColor(Colors.gray, Colors.grayDark),
                            },
                            loading: {
                                color: this.selectColor(Colors.gray, Colors.grayDark),
                            },
                        },
                        contentContainer: {
                            base: styles.contentContainerBase,
                        },
                    }}
                    onPress={this.formRef.current?.submit}
                    label={Translator.trans('user.delete.personal', {}, 'messages')}
                    color={Colors.red}
                    raised
                    theme={theme}
                    uppercase={false}
                />
                <Text style={[styles.footnoteText, this.isDark && styles.textDark]}>
                    {Translator.trans('user.delete.button.description', {}, 'messages')}
                </Text>
            </>
        );
    };

    confirmAgreement = () => {
        Keyboard.dismiss();
        this.confirmBottomSheetRef.current?.dismiss();
    };

    render() {
        const {fields, errors, companyName} = this.state;

        return (
            <>
                <View style={[styles.page, this.isDark && styles.pageDark]}>
                    <Form
                        key='userDelete'
                        ref={this.formRef}
                        fields={fields}
                        onSubmit={this.onSubmit}
                        errors={errors}
                        headerComponent={this.renderHeader}
                        footerComponent={this.renderFooter}
                        fieldsStyles={isAndroid ? stylesMaker(this.selectColor(Colors.gold, DarkColors.gold)) : undefined}
                    />
                </View>
                <ConfirmBottomSheet bottomSheetRef={this.confirmBottomSheetRef} onRightButtonPress={this.confirmAgreement} onDismiss={this.remove} />
                <BusinessWarningBottomSheet bottomSheetRef={this.businessWarningBottomSheetRef} companyName={companyName} />
            </>
        );
    }
}

export const UserDeleteScreen: ProfileStackScreenFunctionalComponent<'UserDelete'> = ({navigation}) => {
    const theme = useTheme();

    return <UserDelete theme={theme} navigation={navigation} />;
};

UserDeleteScreen.navigationOptions = () => ({
    title: Translator.trans('menu.account-delete', {}, 'menu'),
    headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: DarkColors.bgLight,
    },
    header: {
        margin: 15,
        marginBottom: 0,
    },
    title: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 32 : 26,
        fontWeight: '700',
        color: isIOS ? Colors.blue : Colors.orange,
        marginTop: 20,
        marginBottom: 25,
        lineHeight: isIOS ? 33 : 27,
        maxWidth: 339,
    },
    titleDark: {
        color: isIOS ? DarkColors.blue : DarkColors.orange,
    },
    subTitle: {
        fontFamily: Fonts.regular,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 18,
    },
    middleText: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 14 : 13,
        fontWeight: '400',
        lineHeight: 24,
    },
    infoBlockText: {
        color: isIOS ? Colors.textGray : Colors.grayDark,
    },
    footnoteText: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 12 : 13,
        lineHeight: 18,
        color: Colors.grayDark,
        marginHorizontal: 15,
    },
    text: {
        color: Colors.grayDark,
    },
    textDark: {
        color: Colors.white,
    },
    infoBlockWrap: {
        marginTop: 18,
        marginBottom: isIOS ? 25 : 22,
    },
    infoWrap: {
        marginTop: 12,
        flexDirection: 'row',
    },
    iconWrap: {
        width: 36,
        height: 36,
        marginRight: 12,
        borderRadius: 36,
        borderWidth: 1,
        borderColor: Colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapDark: {
        borderColor: DarkColors.border,
    },
    buttonViewBase: {
        flex: 1,
        marginHorizontal: 14,
        padding: 0,
        marginVertical: 0,
        height: 50,
    },
    buttonBase: {
        borderWidth: 1,
        borderRadius: 6,
        height: 50,
        justifyContent: 'center',
    },
    labelBase: {
        fontSize: 14,
        fontWeight: '700',
    },
    contentContainerBase: {
        height: 50,
    },
});
