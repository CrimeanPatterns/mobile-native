import Translator from 'bazinga-translator';
import fromColor from 'color';
import React from 'react';
import {ColorSchemeName, StyleSheet, Text, View} from 'react-native';

import {isAndroid} from '../../../helpers/device';
import Intro from '../../../services/intro';
import NotificationManager from '../../../services/notification';
import {Colors, DarkColors} from '../../../styles';
import {useDark, withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import Header from '../../page/header';
import {TouchableBackground} from '../../page/touchable';
import {BackgroundLocationImage} from '../backgroundImage/backgroundLocation';
import styles from '../styles';

type BackgroundLocationIntroProps = {
    theme: ColorSchemeName;
    onComplete: () => void;
};

type BackgroundLocationIntroState = {
    hasLocationPermission: boolean;
    hasBackgroundPermission: boolean;
};

const ListRow: React.FunctionComponent<{
    onPress: () => void;
    pressable: boolean;
    active: boolean;
    disabled?: boolean;
    title: string;
    caption: string;
}> = ({onPress, pressable, active, disabled = false, title, caption}) => {
    const isDark = useDark();
    const iconActiveColor = isDark ? DarkColors.green : Colors.green;
    const iconColor = isDark ? DarkColors.border : Colors.gray;

    return (
        <TouchableBackground
            onPress={onPress}
            disabled={!pressable}
            rippleColor={isDark ? DarkColors.bgLight : Colors.gray}
            activeBackgroundColor={isDark ? DarkColors.bg : Colors.grayLight}
            style={[style.row, isDark && style.rowDark]}>
            <View style={style.columnLeft}>
                <Icon name={'android-photo-check-blank'} color={active ? iconActiveColor : iconColor} />
            </View>
            <View style={style.columnCenter}>
                <Text style={[styles.text, styles.textBold, isDark && styles.textDark, {fontSize: 14}]}>{title}</Text>
                <Text style={[styles.text, style.caption, isDark && style.captionDark]}>{caption}</Text>
            </View>
            <View style={style.columnRight}>
                <Icon name={'arrow'} color={isDark ? DarkColors.border : Colors.gray} />
            </View>
            {disabled && <View style={[style.disabled, isDark && style.disabledDark]} />}
        </TouchableBackground>
    );
};

// @ts-ignore
@withTheme
class BackgroundLocationIntro extends BaseThemedPureComponent<BackgroundLocationIntroProps, BackgroundLocationIntroState> {
    constructor(props) {
        super(props);

        this.state = {
            hasLocationPermission: false,
            hasBackgroundPermission: false,
        };

        this.close = this.close.bind(this);
        this.requestLocationPermission = this.requestLocationPermission.bind(this);
        this.requestBackgroundLocationPermission = this.requestBackgroundLocationPermission.bind(this);
    }

    componentDidMount() {
        this.checkPermissions();
    }

    async checkPermissions() {
        const [hasLocationPermission, hasBackgroundPermission] = await Promise.all([
            NotificationManager.checkLocationPermission(),
            NotificationManager.checkBackgroundLocationPermission(),
        ]);

        this.setState({
            hasLocationPermission,
            hasBackgroundPermission,
        });
    }

    async requestLocationPermission() {
        await NotificationManager.requestLocationPermission();
        const hasLocationPermission = await NotificationManager.checkLocationPermission();

        this.setState({hasLocationPermission});
    }

    async requestBackgroundLocationPermission() {
        await NotificationManager.requestBackgroundLocationPermission();
        const hasBackgroundPermission = await NotificationManager.checkBackgroundLocationPermission();

        this.setState({hasBackgroundPermission});

        if (hasBackgroundPermission) {
            this.close();
        }
    }

    close() {
        const {onComplete} = this.props;

        onComplete();

        Intro.performedLocation();
    }

    renderImage() {
        return <BackgroundLocationImage />;
    }

    getIntroText() {
        return 'AwardWallet collects location data to enable the delivery of your loyalty cards (with bar codes) that can be used at the point of sale when you walk into a store whose loyalty account you added to your AwardWallet profile even when the app is closed or not in use.';
    }

    render() {
        const {hasLocationPermission, hasBackgroundPermission} = this.state;

        return (
            <View style={{flex: 1}}>
                {this.renderImage()}
                <Header
                    fullScreen={isAndroid}
                    headerColor={isAndroid ? this.selectColor(Colors.blueDark, DarkColors.bgLight) : undefined}
                    title={Translator.trans(/** @Desc("Background Location Permission") */ 'background-location-permission', {}, 'mobile-native')}
                />
                <View style={styles.content}>
                    <Text style={[styles.title, this.isDark && styles.textDark, styles.textBold]}>{'Use your location'}</Text>
                    <Text style={[styles.containerInner, styles.text, this.isDark && styles.textDark]}>{this.getIntroText()}</Text>
                    <ListRow
                        pressable={!hasLocationPermission}
                        active={hasLocationPermission}
                        onPress={this.requestLocationPermission}
                        title={'Step 1'}
                        caption={`Allow AwardWallet to use your location once or while using the app`}
                    />
                    <ListRow
                        pressable={hasLocationPermission || !hasBackgroundPermission}
                        active={hasBackgroundPermission}
                        disabled={!hasLocationPermission}
                        onPress={this.requestBackgroundLocationPermission}
                        title={'Step 2'}
                        caption={`Allow AwardWallet to use your location 'All the time'`}
                    />
                    <View style={{flexDirection: 'row', height: 60, justifyContent: 'center'}}>
                        <TouchableBackground
                            onPress={this.close}
                            style={{alignSelf: 'center', padding: 6}}
                            rippleColor={this.isDark ? DarkColors.border : Colors.gray}
                            activeBackgroundColor={this.isDark ? DarkColors.bg : Colors.grayLight}>
                            <Text style={[styles.text, this.isDark && {color: Colors.grayDarkLight}]}>{`No Thanks`}</Text>
                        </TouchableBackground>
                    </View>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
    },
    rowDark: {
        borderBottomColor: DarkColors.border,
    },
    columnLeft: {
        justifyContent: 'center',
        paddingRight: 12,
    },
    columnCenter: {
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
    },
    columnRight: {
        justifyContent: 'center',
        paddingLeft: 10,
    },
    disabled: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, .6)',
    },
    disabledDark: {
        backgroundColor: fromColor(DarkColors.bg).alpha(0.7).rgb().string(),
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
    },
    captionDark: {
        color: DarkColors.gray,
    },
});

export {BackgroundLocationIntro};
