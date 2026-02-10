import {StyleSheet} from 'react-native';

import {Colors, Fonts} from '../../../styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        alignSelf: 'flex-start',
        justifyContent: 'center',
        textAlign: 'left',
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: Colors.white,
        paddingLeft: 40,
        marginHorizontal: 16,
    },
    bottomContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: 'transparent',
        alignItems: 'center',
        bottom: 0,
        position: 'absolute',
    },
    bottomInnerContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    bottomContainerView: {
        width: 0,
        height: 0,
    },
    shootButton: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        backgroundColor: '#e0e0e0',
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
