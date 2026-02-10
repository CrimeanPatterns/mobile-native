import {StyleSheet} from 'react-native';

import {isAndroid} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isAndroid ? DarkColors.bg : Colors.black,
    },
    previewContainer: {
        backgroundColor: Colors.white,
    },
    previewContainerDark: {
        backgroundColor: DarkColors.bgLight,
    },
    previewCard: {
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewTitleContainer: {
        flexDirection: 'row',
        maxHeight: 100,
        marginVertical: 15,
        paddingHorizontal: 15,
    },
    previewTitle: {
        width: '100%',
    },
    previewAccountName: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
    previewAccountOwner: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
    previewNumber: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        marginTop: 5,
        marginBottom: 10,
        marginHorizontal: 15,
        color: Colors.grayDark,
    },
    previewNumberDark: {
        color: Colors.grayDark,
    },
    title: {
        flex: 1,
        justifyContent: 'center',
    },
    logo: {},
    barcode: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: Colors.white,
    },
    barcodeDark: {
        borderBottomWidth: 0,
    },
    icon: {
        alignSelf: 'center',
        marginRight: 15,
    },
    footer: {
        flex: 1,
        height: 50,
    },
    footerAndroid: {
        flex: 1,
        height: 100,
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
    },
    footerAndroidDark: {
        borderTopColor: DarkColors.border,
    },
});
