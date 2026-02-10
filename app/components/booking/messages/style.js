import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export const palette = {
    cornerFill: Colors.white,
    inboxBg: isIOS ? Colors.bgGray : Colors.grayLight,
    inboxText: Colors.grayDark,
    outboxBg: isIOS ? Colors.blue : Colors.gold,
    outboxText: Colors.white,
    systemBg: Colors.milkPunch,
    systemBgDark: Colors.chinaIvory,
    systemBorder: Colors.travertine,
    systemText: Colors.textGray,
};

export const htmlStyles = {
    messageText: {
        fontSize: 15,
        fontFamily: Fonts.regular,
    },
};

export const tagsStyles = {
    p: {
        paddingVertical: 7,
    },
    get ul() {
        return {
            paddingVertical: 5,
            paddingLeft: 0,
            marginLeft: 0,
        };
    },
    get li() {
        return {paddingLeft: 0, marginLeft: 0};
    },
    get a() {
        return {
            fontSize: 15,
            fontFamily: Fonts.bold,
            fontWeight: 'bold',
            textDecorationLine: 'none',
            paddingHorizontal: 5,
        };
    },
};

export const cssStyles = `
* {
  margin: 0;
  padding: 0;
  font-family: ${Fonts.regular};
  font-weight: normal;
  font-size: 15px;
}
.bold,
strong,
b {
  font-weight: bold;
}
`;

export default StyleSheet.create({
    message: {
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    messageOut: {
        width: '95%',
        alignSelf: 'flex-end',
    },
    messageHead: {
        position: 'relative',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    author: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 5,
        paddingRight: 15,
        maxWidth: '70%',
    },
    authorThumb: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    authorName: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    authorText: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    date: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
    },
    outboxDate: {
        justifyContent: 'flex-start',
    },
    outboxDateIcon: {
        marginLeft: -24,
    },
    dateCol: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    dateText: {
        fontSize: 11,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    bold: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    inboxCorner: {
        position: 'absolute',
        top: -7,
        left: 13,
    },
    outboxCorner: {
        position: 'absolute',
        top: -7,
        right: 13,
    },
    messageBody: {
        position: 'relative',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        ...Platform.select({
            android: {
                borderRadius: 5,
                overflow: 'hidden',
            },
        }),
    },
    outboxAuthor: {
        position: 'relative',
        paddingRight: 15,
    },
    arrowContainer: {
        position: 'absolute',
        right: -7,
        top: -2,
    },
    arrow: {
        color: Colors.grayDarkLight,
    },
    buttonView: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: palette.systemBgDark,
        borderTopColor: palette.systemBorder,
        borderTopWidth: 1,
    },
    buttonViewDark: {
        backgroundColor: DarkColors.bgLight,
        borderTopColor: DarkColors.border,
    },
    newMessage: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    updatedMessage: {
        marginTop: -3,
    },
});
