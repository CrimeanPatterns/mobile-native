import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import Intro from '../../../services/intro';
import NotificationManager from '../../../services/notification';
import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import {SubmitButton} from '../../form';
import Header from '../../page/header';
import {BackgroundLocationImage} from '../backgroundImage/backgroundLocation';
import styles, {introColors} from '../styles';

@withTheme
class LocationIntro extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onComplete: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            visibleButton: true,
        };

        this.onPress = this.onPress.bind(this);
    }

    async onPress() {
        const {onComplete} = this.props;

        await NotificationManager.requestLocationPermission();
        NotificationManager.initialize();

        const status = onComplete();

        Intro.performedLocation();

        if (status === 'next') {
            setTimeout(() => this.setState({visibleButton: false}), 300);
        }
    }

    renderImage() {
        return <BackgroundLocationImage />;
    }

    getIntroText() {
        return 'AwardWallet collects location data to enable the delivery of your loyalty cards (with bar codes) that can be used at the point of sale when you walk into a store, even when the app is closed.';
        // return Translator.trans(
        //     /** @Desc("AwardWallet collects location data to enable the delivery of your loyalty cards (with bar codes) that can be used at the point of sale when you walk into a store whose loyalty account you added to your AwardWallet profile even when the app is closed or not in use.") */ 'intro.location-permission-content.android',
        //     {},
        //     'mobile-native',
        // );
    }

    render() {
        const {visibleButton} = this.state;
        const {theme} = this.props;

        return (
            <View style={{flex: 1}}>
                {this.renderImage()}
                <Header
                    fullScreen={isAndroid}
                    headerColor={this.selectColor(isIOS ? Colors.grayLight : Colors.blueDark, isIOS ? DarkColors.bg : DarkColors.bgLight)}
                    title={Translator.trans(/** @Desc("Location Permission") */ 'intro.location-permission-title', {}, 'mobile-native')}
                />
                <View style={styles.content}>
                    <Text style={[styles.title, this.isDark && styles.textDark, styles.textBold]}>
                        {'For the best experience, please allow AwardWallet location access.'}
                    </Text>
                    <Text style={[styles.text, styles.containerInner, this.isDark && styles.textDark]}>{this.getIntroText()}</Text>
                    {visibleButton && (
                        <SubmitButton
                            onPress={this.onPress}
                            label={Translator.trans('continue', {}, 'messages')}
                            raised
                            color={this.selectColor(introColors.buttonColor, introColors.buttonColorDark)}
                            theme={theme}
                        />
                    )}
                </View>
            </View>
        );
    }
}

export default LocationIntro;
