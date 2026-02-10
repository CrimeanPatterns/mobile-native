import {Platform, StatusBar, StyleSheet} from 'react-native';

import {Colors, Fonts} from '../../../styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Platform.select({ios: Colors.white, android: Colors.black}),
    },
    containerDark: {
        backgroundColor: Colors.black,
    },
    preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    tooltip: {
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: Colors.white,
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight + 20,
            },
            ios: {},
        }),
    },
    bottomContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: 'rgba(0,0,0,0.5)',
        bottom: 0,
        position: 'absolute',
    },
    bottomInnerContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomContainerView: {
        width: 60,
        height: 60,
    },
    shootButton: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        borderColor: Colors.white,
        borderWidth: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shootInnerCircle: {
        width: 55,
        margin: 5,
        height: 55,
        borderRadius: 55 / 2,
        backgroundColor: Colors.white,
        alignSelf: 'center',
    },
});
