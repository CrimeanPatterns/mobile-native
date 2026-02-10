import {StyleSheet} from 'react-native';

import {Colors, Fonts} from '../../../styles';
import {IconColors} from '../../../styles/icons';

export default StyleSheet.create({
    pageMenu: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f7f8f9',
        flexWrap: 'nowrap',
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: '#dfe1e6',
    },
    user: {
        paddingTop: 30,
        height: 100,
        marginHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7ea',
        borderStyle: 'solid',
    },
    userItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    userPicture: {
        width: 42,
        height: 42,
        backgroundColor: Colors.white,
        borderRadius: 21,
        overflow: 'hidden',
    },
    userDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        paddingLeft: 15,
    },
    userName: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        marginBottom: 3,
        color: '#4d5971',
    },
    userStatus: {
        fontFamily: Fonts.regular,
        fontSize: 10,
        color: '#99a0ad',
    },
    userSilver: {
        fontSize: 10,
        color: Colors.white,
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
        marginLeft: 5,
        height: 12,
        backgroundColor: '#99a0ad',
        textAlign: 'center',
    },
    menu: {
        marginHorizontal: 15,
    },
    menuItem: {
        height: 50,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        flex: 1,
        width: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuText: {
        paddingLeft: 30,
        fontSize: 15,
        color: '#4d5971',
        fontFamily: Fonts.regular,
        flex: 1,
    },
    menuActive: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        borderStyle: 'solid',
        marginHorizontal: 15,
    },
    item: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 15,
    },
    title: {
        fontFamily: Fonts.regular,
        color: '#4d5971',
        fontSize: 11,
        lineHeight: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    icon: {
        color: IconColors.gray,
    },
    col: {
        width: '25%',
    },
    separator: {
        height: 1,
        backgroundColor: '#e5e7ea',
    },
});
