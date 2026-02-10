import {Backdrop} from '@components/accounts/list/bottomSheet/backdrop';
import {TouchableBackground} from '@components/page/touchable';
import {BottomSheetModal, useBottomSheetDynamicSnapPoints} from '@gorhom/bottom-sheet';
import {Colors, DarkColors} from '@styles/index';
import {useDark} from '@theme/use-theme';
import Translator from 'bazinga-translator';
import React, {useMemo, useState} from 'react';
import {Text, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import styles from './styles';

type ConfirmBottomSheetProps = {
    bottomSheetRef: React.RefObject<BottomSheetModal>;
    onRightButtonPress: () => void;
    onDismiss: () => void;
};

const ConfirmBottomSheet: React.FC<ConfirmBottomSheetProps> = ({bottomSheetRef, onRightButtonPress, onDismiss}) => {
    const isDark = useDark();
    const [isCancel, setIsCancel] = useState(false);
    const initialSnapPoint = useMemo(() => ['CONTENT_HEIGHT'], []);
    const {animatedSnapPoints, animatedHandleHeight, animatedContentHeight, handleContentLayout} = useBottomSheetDynamicSnapPoints(initialSnapPoint);

    const selectColor = (light, dark) => (isDark ? dark : light);

    const dismissBottomSheet = () => {
        bottomSheetRef.current?.dismiss();
        setIsCancel(true);
    };

    const handleRightButtonClick = () => {
        onRightButtonPress();
        setIsCancel(false);
    };

    const handleDismiss = () => {
        if (!isCancel) {
            onDismiss();
            setIsCancel(true);
        }
    };

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            onDismiss={handleDismiss}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            handleIndicatorStyle={styles.indicator}
            backgroundStyle={{backgroundColor: selectColor(Colors.grayLight, DarkColors.bg)}}
            backdropComponent={(props) => Backdrop({...props, onPress: dismissBottomSheet})}>
            <View style={styles.contentWrap} onLayout={handleContentLayout}>
                <Text style={[styles.title, isDark && styles.titleDark]}>{Translator.trans('alerts.text.confirm', {}, 'messages')}</Text>
                <Text style={[styles.description, isAndroid && styles.opacity, isDark && styles.descriptionDark]}>
                    {Translator.trans('user.delete.confirm-text', {}, 'messages')}
                </Text>
                <View style={styles.buttonBlockWrap}>
                    <View style={[styles.buttonWrap, styles.marginRight]}>
                        <TouchableBackground
                            style={[styles.button, styles.cancelButton, isDark && styles.cancelButtonDark]}
                            rippleColor={selectColor(Colors.gray, DarkColors.bgLight)}
                            activeBackgroundColor={selectColor(Colors.gray, DarkColors.bgLight)}
                            onPress={dismissBottomSheet}>
                            <Text style={[styles.buttonText, styles.cancelText, isDark && styles.cancelTextDark]}>
                                {Translator.trans('button.cancel', {}, 'messages')}
                            </Text>
                        </TouchableBackground>
                    </View>
                    <View style={styles.buttonWrap}>
                        <TouchableBackground
                            style={styles.button}
                            backgroundColor={isIOS ? selectColor(Colors.deepBlue, DarkColors.blue) : Colors.blueDark}
                            rippleColor={isIOS ? selectColor(Colors.blueDark, DarkColors.blueDark) : Colors.deepBlue}
                            activeBackgroundColor={isIOS ? selectColor(Colors.blueDark, DarkColors.blueDark) : Colors.deepBlue}
                            onPress={handleRightButtonClick}>
                            <Text style={[styles.buttonText, styles.okText]}>{Translator.trans('alerts.btn.ok', {}, 'messages')}</Text>
                        </TouchableBackground>
                    </View>
                </View>
            </View>
        </BottomSheetModal>
    );
};

export default ConfirmBottomSheet;
