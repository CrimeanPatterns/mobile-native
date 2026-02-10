import {Platform, StyleSheet} from 'react-native';

import {isTablet} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

let additional = {};

const base = {
    flex1: {flex: 1},
    page: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
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
    pageView: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    logoWrapper: {
        // width: '100%',
    },
    logo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    logoText: {
        color: Colors.white,
    },
    logoTextDark: {
        ...Platform.select({
            android: {
                color: DarkColors.text,
            },
        }),
    },
    form: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formTop: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: '100%',
        ...Platform.select({
            ios: {
                backgroundColor: Colors.white,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#d6dae6',
            },
            android: {
                // paddingHorizontal: 40
            },
        }),
    },
    formTopDark: {
        backgroundColor: DarkColors.bg,
        borderColor: DarkColors.border,
    },
    formInner: {
        width: '80%',
    },
    formColumn: {
        minWidth: '10%',
        flexDirection: 'column',
        backgroundColor: Colors.white,
    },
    formBottom: {
        flex: 1,
        justifyContent: 'space-between',
        width: '80%',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            android: {
                // paddingHorizontal: 40,
            },
        }),
        paddingVertical: 25,
    },
    buttonsContainer: {
        width: '80%',
        ...Platform.select({
            ios: {
                marginTop: 20,
            },
            android: {
                marginTop: 30,
            },
        }),
    },
    bottomContainerWrap: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    silverLink: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 13,
                lineHeight: 13,
                color: '#808797',
            },
            android: {
                fontSize: 14,
                lineHeight: 14,
                color: '#9e9e9e',
            },
        }),
    },

    textSilverDark: {
        color: DarkColors.text,
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
    lock: {
        marginVertical: 25,
        ...Platform.select({
            ios: {
                color: '#b6bcca',
            },
            android: {
                color: '#b8becc',
            },
        }),
    },
    keyCodeContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 18,
        width: '80%',
    },
    keyCodeLabel: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        textAlign: 'center',
    },
    keyCodeHint: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: Fonts.regular,
        color: '#a1a7b3',
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#d6dae6',
        minWidth: '100%',
        maxWidth: '100%',
        marginLeft: 0,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    oauthButtonContainer: {},
    oauthButton: {
        marginBottom: 10,
    },
    or: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 20,
    },
    leftLineSeparator: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flex: 1,
        marginLeft: 20,
        marginRight: 10,
    },
    rightLineSeparator: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flex: 1,
        marginLeft: 10,
        marginRight: 20,
    },
    textSeparator: {
        color: Colors.grayDark,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: isTablet ? '15%' : '60%',
    },
};

if (isTablet) {
    additional = {
        formTop: {
            ...base.formTop,
            alignItems: 'center',
            ...Platform.select({
                android: {
                    maxHeight: 200,
                },
            }),
        },
        formInner: {
            ...base.formInner,
            width: '70%',
        },
        formColumn: {
            ...base.formColumn,
            minWidth: '15%',
        },
        formColumnLandscape: {
            width: '20%',
        },
        formBottom: {
            ...base.formBottom,
            width: '70%',
        },
        buttonsContainer: {
            ...base.buttonsContainer,
            width: '70%',
        },
        landscape: {
            width: '60%',
        },
    };
}

// @ts-ignore
const styles = StyleSheet.create({...base, ...additional});

const inputStyle = {
    container: {
        base: {
            width: '100%',
            paddingHorizontal: 0,
            ...Platform.select({
                ios: {
                    marginVertical: 0,
                    marginHorizontal: 0,
                },
                android: {
                    marginTop: 10,
                },
            }),
        },
    },
    label: {
        base: {
            ...Platform.select({
                ios: {
                    opacity: 0,
                    height: 0,
                },
            }),
        },
    },
    hint: {
        base: {
            opacity: 0,
            height: 0,
            margin: 0,
        },
    },
    fieldContainer: {
        base: {
            ...Platform.select({
                ios: {
                    marginTop: 0,
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    paddingHorizontal: 0,
                    paddingLeft: 0,
                    backgroundColor: 'transparent',
                },
            }),
        },
    },
};

const buttonStyle = {
    get button() {
        return {
            get base() {
                return {
                    marginHorizontal: 0,
                    width: '100%',
                    ...Platform.select({
                        ios: {
                            backgroundColor: '#1466b3',
                        },
                        android: {
                            backgroundColor: Colors.blueDark,
                        },
                    }),
                };
            },
            get disabled() {
                return {
                    backgroundColor: '#1466b3',
                };
            },
        };
    },
    get label() {
        return {
            base: {
                ...Platform.select({
                    ios: {
                        height: 45,
                        lineHeight: 45,
                        fontSize: 15,
                    },
                    android: {
                        color: Colors.white,
                    },
                }),
            },
            get disabled() {
                return {
                    ...Platform.select({
                        ios: {
                            color: '#5c93cc',
                        },
                        android: {
                            color: '#5c93cc',
                        },
                    }),
                };
            },
        };
    },
    contentContainer: {
        base: {
            ...Platform.select({
                android: {
                    height: 45,
                },
            }),
        },
    },
};

const buttonDarkStyle = {
    get button() {
        return {
            get base() {
                return {
                    marginHorizontal: 0,
                    width: '100%',
                    ...Platform.select({
                        ios: {
                            backgroundColor: DarkColors.blue,
                        },
                        android: {
                            backgroundColor: DarkColors.blue,
                        },
                    }),
                };
            },
            get disabled() {
                return {
                    backgroundColor: DarkColors.blueDark,
                };
            },
        };
    },
    get label() {
        return {
            base: {
                ...Platform.select({
                    ios: {
                        height: 45,
                        lineHeight: 45,
                        fontSize: 15,
                    },
                    android: {
                        color: Colors.white,
                    },
                }),
            },
            get disabled() {
                return {
                    ...Platform.select({
                        ios: {
                            color: '#175bb5',
                        },
                        android: {
                            color: '#5c93cc',
                        },
                    }),
                };
            },
        };
    },
    contentContainer: {
        base: {
            ...Platform.select({
                android: {
                    height: 45,
                },
            }),
        },
    },
};

const buttonStyleWhite = {
    get button() {
        return {
            get base() {
                return {
                    marginHorizontal: 0,
                    width: '100%',
                    backgroundColor: Colors.white,
                    ...Platform.select({
                        ios: {
                            borderWidth: 1,
                            borderColor: '#3189cc',
                        },
                        android: {
                            elevation: 1,
                        },
                    }),
                };
            },
            get disabled() {
                return {
                    backgroundColor: '#1466b3',
                };
            },
        };
    },
    get label() {
        return {
            get base() {
                return Platform.select({
                    ios: {
                        height: 45,
                        lineHeight: 45,
                        color: '#3189cc',
                        fontSize: 17,
                    },
                    android: {
                        color: Colors.blueDark,
                        fontSize: 14,
                    },
                });
            },
            pressed: {
                color: '#3189cc',
            },
            get disabled() {
                return {
                    ...Platform.select({
                        ios: {
                            color: '#5c93cc',
                        },
                        android: {
                            color: '#5c93cc',
                        },
                    }),
                };
            },
        };
    },
    contentContainer: {
        base: {
            ...Platform.select({
                android: {
                    height: 45,
                },
            }),
        },
    },
};

const buttonDarkStyleWhite = {
    get button() {
        return {
            get base() {
                return {
                    marginHorizontal: 0,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: DarkColors.blue,
                    backgroundColor: DarkColors.bg,
                    ...Platform.select({
                        android: {
                            elevation: 1,
                        },
                    }),
                };
            },
            pressed: {
                color: Colors.green,
            },
            get disabled() {
                return {
                    backgroundColor: DarkColors.blueDark,
                };
            },
        };
    },
    get label() {
        return {
            get base() {
                return Platform.select({
                    ios: {
                        height: 45,
                        lineHeight: 45,
                        color: DarkColors.blue,
                        fontSize: 17,
                    },
                    android: {
                        color: DarkColors.blue,
                        fontSize: 14,
                    },
                });
            },
            pressed: {
                color: '#3189cc',
            },
            get disabled() {
                return {
                    ...Platform.select({
                        ios: {
                            color: '#175bb5',
                        },
                        android: {
                            color: '#5c93cc',
                        },
                    }),
                };
            },
        };
    },
    contentContainer: {
        base: {
            ...Platform.select({
                android: {
                    height: 45,
                },
            }),
        },
    },
};

export {styles, inputStyle, buttonStyle, buttonDarkStyle, buttonStyleWhite, buttonDarkStyleWhite};
