import {StyleSheet} from 'react-native';

import {isTablet} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

let additional;

const base = {
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: Colors.black,
    },
    textDark: {
        color: Colors.white,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        minHeight: 90,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.regular,
        color: Colors.textGray,
        marginBottom: 10,
    },
    details: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
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
        backgroundColor: Colors.white,
        width: 24,
        height: 24,
    },
    iconSilver: {
        color: '#bec2cc',
    },
    text: {
        fontSize: 11,
        color: Colors.textGray,
        fontFamily: Fonts.regular,
    },
    silverText: {
        fontSize: 11,
        color: '#bec2cc',
        fontFamily: Fonts.regular,
    },
    orangeText: {
        color: Colors.orange,
    },
    date: {
        fontSize: 20,
        color: Colors.textGray,
        lineHeight: 20,
        fontFamily: Fonts.regular,
    },
    bigText: {
        fontSize: 12,
    },
    boldText: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    addAccount: {
        marginVertical: 10,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.grayLight,
        height: 60,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAccountText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDark,
        marginLeft: 10,
    },
    addAccountDark: {
        borderColor: DarkColors.border,
        backgroundColor: DarkColors.bgLight,
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        padding: 25,
    },
    noFoundText: {
        fontSize: 13,
        marginHorizontal: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    disabled: {
        color: '#bec2cc',
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
    arrow: {
        marginLeft: 10,
        marginRight: -5,
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
