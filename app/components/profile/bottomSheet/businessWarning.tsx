import {Backdrop} from '@components/accounts/list/bottomSheet/backdrop';
import Icon from '@components/icon';
import {TouchableBackground} from '@components/page/touchable';
import {BottomSheetModal, useBottomSheetDynamicSnapPoints} from '@gorhom/bottom-sheet';
import {Colors, DarkColors} from '@styles/index';
import {useDark} from '@theme/use-theme';
import Translator from 'bazinga-translator';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import HTML from 'react-native-render-html';

import {isAndroid, isIOS} from '../../../helpers/device';
import {openExternalUrl} from '../../../helpers/navigation';
import styles from './styles';

type BusinessWarningBottomSheetProps = {
    bottomSheetRef: React.RefObject<BottomSheetModal>;
    companyName: string | undefined;
};
const BusinessWarningBottomSheet: React.FC<BusinessWarningBottomSheetProps> = ({bottomSheetRef, companyName}) => {
    const isDark = useDark();
    const initSnapPoint = useMemo(() => ['CONTENT_HEIGHT'], []);
    const {animatedSnapPoints, animatedHandleHeight, animatedContentHeight, handleContentLayout} = useBottomSheetDynamicSnapPoints(initSnapPoint);

    const selectColor = (light, dark) => (isDark ? dark : light);

    const dismissBottomSheet = () => bottomSheetRef.current?.dismiss();

    const renderSubtitle = () => {
        const content = `<p>${Translator.trans(
            'user.delete.popup-text1',
            {
                businessName: companyName,
            },
            'messages',
        )}</p>`;

        return (
            <HTML
                source={{html: content}}
                tagsStyles={{
                    p: {margin: 0},
                    b: {fontWeight: isDark || isAndroid ? '800' : '400'},
                }}
                baseFontStyle={{...styles.subTitle, ...(isDark && styles.subTitleDark)}}
            />
        );
    };

    const renderDescription = () => {
        const firstPath = Translator.trans(
            /** @Desc("If you delete your personal account all of the programs that are assigned to you will be deleted. In addition to that you will lose access to the business") */ 'user.delete.popup-text2',
            {},
            'mobile-native',
        );
        const secondPath = Translator.trans(
            'user.delete.popup-text3',
            {
                href: 'javascript: void(0)',
            },
            'messages',
        );

        const html = `<p class="first">${firstPath}</p><p>${secondPath}</p>`;

        return (
            <HTML
                source={{html}}
                tagsStyles={{
                    p: {margin: 0, textAlign: 'center'},
                    a: {...styles.link, ...(isDark && styles.linkDark)},
                    b: {color: selectColor(Colors.red, DarkColors.red)},
                }}
                classesStyles={{
                    first: {marginBottom: 14},
                }}
                baseFontStyle={{...styles.description, ...(isAndroid && styles.androidDescription), ...(isDark && styles.descriptionDark)}}
                onLinkPress={() => openExternalUrl({url: `https://business.awardwallet.com/`})}
            />
        );
    };

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            backgroundStyle={{backgroundColor: selectColor(Colors.grayLight, DarkColors.bg)}}
            backdropComponent={(props) => Backdrop({...props, onPress: dismissBottomSheet})}
            handleIndicatorStyle={styles.indicator}>
            <View onLayout={handleContentLayout} style={styles.contentWrap}>
                <View style={styles.titleWrap}>
                    <Icon name={'warning'} size={18} color={selectColor(Colors.orange, DarkColors.orange)} style={{marginRight: 6}} />
                    <Text style={[styles.title, styles.warningTitle, isDark && styles.titleDark]}>
                        {Translator.trans('alerts.warning', {}, 'messages') + '!'}
                    </Text>
                </View>
                <View style={[styles.blueBlockWrap, isDark && styles.blueBlockWrapDark]}>{renderSubtitle()}</View>
                {renderDescription()}
                <View style={styles.warningButtonWrap}>
                    <TouchableBackground
                        style={styles.button}
                        backgroundColor={isIOS ? selectColor(Colors.deepBlue, DarkColors.blue) : Colors.blueDark}
                        rippleColor={isIOS ? selectColor(Colors.blueDark, DarkColors.blueDark) : Colors.deepBlue}
                        activeBackgroundColor={isIOS ? selectColor(Colors.blueDark, DarkColors.blueDark) : Colors.deepBlue}
                        onPress={dismissBottomSheet}>
                        <Text style={[styles.buttonText, styles.okText]}>{Translator.trans('alerts.btn.ok', {}, 'messages')}</Text>
                    </TouchableBackground>
                </View>
            </View>
        </BottomSheetModal>
    );
};

export default BusinessWarningBottomSheet;
