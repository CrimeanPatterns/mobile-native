import {Platform, StyleSheet} from 'react-native';

import {isTablet} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

let additional;

const base = {
    page: {
        flex: 1,
        backgroundColor: Colors.gray,
    },
    pageDark: {
        backgroundColor: DarkColors.bg,
    },
    textDark: {
        color: DarkColors.text,
    },
    containerWrap: {
        marginTop: 8,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginHorizontal: 8,
        marginBottom: 8,
        backgroundColor: Colors.white,
        elevation: 5,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
            },
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    caption: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-end',
    },
    details: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 64,
    },
    title: {
        fontSize: 20,
        lineHeight: 20,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    col: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
    iconStatus: {
        backgroundColor: Colors.black,
    },
    iconSilver: {
        color: Colors.grayDarkLight,
    },
    text: {
        fontSize: 11,
        lineHeight: 13,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    silverText: {
        fontSize: 12,
        lineHeight: 14,
        color: '#9e9e9e',
        fontFamily: Fonts.regular,
    },
    orangeText: {
        color: Colors.orange,
    },
    date: {
        fontSize: 20,
        color: Colors.grayDark,
        lineHeight: 20,
        fontFamily: Fonts.regular,
    },
    bigText: {
        fontSize: 12,
        lineHeight: 14,
    },
    boldText: {
        fontFamily: Fonts.bold,
        fontWeight: '500',
    },
    arrow: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        padding: 25,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
    },
    noFoundText: {
        fontSize: 13,
        marginLeft: 25,
        color: '#9b9b9b',
        fontFamily: Fonts.regular,
    },
    disabled: {
        color: '#9e9e9e',
    },
    status: {
        width: 85,
    },
    flight: {
        width: 70,
    },
    action: {
        width: 135,
    },
};

if (isTablet) {
    additional = {
        details: {
            ...base.details,
            justifyContent: 'flex-start',
        },
        status: {
            ...base.status,
            width: 150,
        },
        flight: {
            ...base.flight,
            width: 120,
        },
        action: {
            ...base.action,
            width: 180,
        },
    };
}

export default StyleSheet.create({...base, ...additional});
