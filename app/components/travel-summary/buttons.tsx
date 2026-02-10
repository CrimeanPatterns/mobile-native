import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useRef} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Button, FAB} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {isAndroid, isIOS} from '../../helpers/device';
import {Colors} from '../../styles';
import {ColorSchemeDark, useTheme} from '../../theme';
import HeaderButton from '../page/header/button';
import Picker from '../page/picker';

const HeaderLeftButton: React.FunctionComponent<{
    onClose: () => void;
}> = ({onClose}) => {
    const theme = useTheme();

    if (isAndroid) {
        return <FAB style={styles.fabClose} small icon='close' color={Colors.grayDark} onPress={onClose} />;
    }

    return (
        <View style={[styles.fabClose, styles.button, styles.buttonClose, theme === ColorSchemeDark && styles.buttonDark]}>
            <HeaderButton onPress={onClose} iconName='android-clear' />
        </View>
    );
};

const HeaderRightButton: React.FunctionComponent<{
    onPress: () => void;
    title: string;
}> = ({onPress, title}) => {
    const theme = useTheme();

    if (isAndroid) {
        return (
            <Button raised={false} style={styles.button} color={Colors.grayDark} onPress={onPress}>
                {title}
            </Button>
        );
    }

    return (
        <View style={[styles.button, styles.buttonRight, theme === ColorSchemeDark && styles.buttonDark]}>
            <HeaderButton
                onPress={onPress}
                title={title}
                titleStyle={[styles.headerButtonTitle, theme === ColorSchemeDark && styles.headerButtonTitleDark]}
            />
        </View>
    );
};

const HeaderRightButtons: React.FunctionComponent<React.PropsWithChildren> = ({children}) => (
    <View style={[{right: 16}]}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={[{flexDirection: 'row', paddingLeft: isIOS ? 80 : 100, flexWrap: 'wrap', justifyContent: 'flex-end'}]}>{children}</View>
        </View>
    </View>
);

type Owner = [];
type Period = [];

const HeaderButtons: React.FunctionComponent<{
    onClose: () => void;
    changeOwner: () => void;
    changeDate: () => void;
    owners: Owner[];
    periods: Period[];
    currentUser: unknown;
    currentPeriod: number;
    setCurrentUser: () => void;
    setCurrentPeriod: () => void;
}> = ({onClose, owners, periods, currentUser, currentPeriod, setCurrentUser, setCurrentPeriod}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const isEmpty = _.isEmpty(owners) || _.isEmpty(periods);

    const ownerPickerRef = useRef<Picker>(null);
    const datePickerRef = useRef<Picker>(null);

    const openOwnerPicker = useCallback(() => {
        ownerPickerRef.current?.show();
    }, []);
    const openDatePicker = useCallback(() => {
        datePickerRef.current?.show();
    }, []);

    const changeOwner = (_value, index) => {
        setCurrentUser(owners[index][0]);
    };
    const changePeriod = (_value, index) => {
        setCurrentPeriod(periods[index][0]);
    };

    return (
        <View style={[{top: insets.top + 10, position: 'absolute', left: 0, width: '100%'}]}>
            {isEmpty === false && (
                <>
                    <HeaderRightButtons>
                        <HeaderRightButton onPress={openOwnerPicker} title={owners[currentUser][1]} />
                        <HeaderRightButton onPress={openDatePicker} title={periods[currentPeriod][1]} />
                    </HeaderRightButtons>
                    <Picker
                        ref={ownerPickerRef}
                        pickerRef={_.noop}
                        value={currentUser}
                        title={Translator.trans('select-traveler', {}, 'mobile-native')}
                        items={owners.map(([, name]) => name)}
                        onValueChange={changeOwner}
                        cancelButton={Translator.trans('alerts.btn.cancel')}
                        confirmButton={Translator.trans('card-pictures.label.confirm')}
                    />
                    <Picker
                        ref={datePickerRef}
                        pickerRef={_.noop}
                        value={currentPeriod}
                        title='Select timeframe'
                        items={periods.map(([, name]) => name)}
                        onValueChange={changePeriod}
                        cancelButton={Translator.trans('alerts.btn.cancel')}
                        confirmButton={Translator.trans('card-pictures.label.confirm')}
                    />
                </>
            )}
            <HeaderLeftButton onClose={onClose} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        right: 16,
    },
    button: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 5,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                paddingHorizontal: 5,
            },
            android: {
                backgroundColor: 'rgba(255,255,255,1)',
                elevation: 2,
                marginRight: 5,
            },
        }),
    },
    fabClose: {
        position: 'absolute',
        left: 16,
        top: 0,
        ...Platform.select({
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
    buttonClose: {
        width: 35,
    },
    buttonDark: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    buttonRight: {
        marginRight: 10,
    },
    headerButtonTitle: {
        fontSize: 15,
        color: Colors.grayDark,
    },
    headerButtonTitleDark: {
        color: Colors.white,
    },
});

export {HeaderButtons, HeaderLeftButton, HeaderRightButton, HeaderRightButtons};
