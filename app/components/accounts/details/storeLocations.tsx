import Translator from 'bazinga-translator';
import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles, {
    accountDetailsActiveBackgroundColor,
    accountDetailsActiveBackgroundColorDark,
    accountDetailsRippleColor,
    accountDetailsRippleColorDark,
} from './styles';

type AccountStoreLocationsItem = {
    LocationID: string;
    LocationName: string;
    Tracked: boolean;
};

type AccountStoreLocationsProps = AccountBlockItem<AccountKind.storeLocations, AccountStoreLocationsItem[]>;

class AccountStoreLocations extends AccountDetailsRow<AccountStoreLocationsProps> {
    get underlayColor(): string {
        return this.selectColor(Colors.grayLight, DarkColors.bg);
    }

    navigateLocation = (LocationID: string): void => {
        const {navigation, route} = this.props;
        const accountId = route.params?.ID;
        const subId = route.params?.SubAccountID;

        navigation.navigate('StoreLocations', {accountId, subId, locationId: LocationID});
    };

    navigateList = (): void => {
        const {navigation, route} = this.props;
        const accountId = route.params?.ID;
        const subId = route.params?.SubAccountID;

        navigation.navigate('StoreLocations', {
            accountId,
            subId,
        });
    };

    renderRow = ({LocationID, LocationName, Tracked}: AccountStoreLocationsItem, index: number): ReactElement => (
        <React.Fragment key={`location-${LocationID}`}>
            {this.renderTopSeparator()}
            <TouchableBackground
                testID={`location-${index}`}
                rippleColor={this.selectColor(accountDetailsRippleColor, accountDetailsRippleColorDark)}
                activeBackgroundColor={this.selectColor(accountDetailsActiveBackgroundColor, accountDetailsActiveBackgroundColorDark)}
                accessible
                accessibilityLabel={LocationName}
                onPress={() => this.navigateLocation(LocationID)}>
                <View style={styles.itemRow} pointerEvents='box-only'>
                    <Text
                        style={[
                            styles.flex1,
                            styles.text,
                            this.isDark && styles.textDark,
                            !Tracked && {color: this.selectColor(Colors.gray, DarkColors.text)},
                        ]}
                        numberOfLines={2}>
                        {LocationName}
                    </Text>
                    {isIOS && this.renderArrow()}
                </View>
            </TouchableBackground>
            {this.renderBottomSeparator()}
        </React.Fragment>
    );

    render(): ReactElement {
        const {item} = this.props;

        return (
            <>
                {this.renderTopSeparator()}
                <View style={[styles.itemRow, styles.marginTop]}>
                    <Text style={[styles.text, styles.textLarge, this.isDark && styles.textDark]}>
                        {Translator.trans('store-location.title', {}, 'mobile')}
                    </Text>
                </View>
                {this.renderBottomSeparator()}
                {item.Val.map(this.renderRow)}
                <TouchableBackground
                    rippleColor={this.selectColor(accountDetailsRippleColor, accountDetailsRippleColorDark)}
                    activeBackgroundColor={this.selectColor(accountDetailsActiveBackgroundColor, accountDetailsActiveBackgroundColorDark)}
                    onPress={this.navigateList}>
                    <View style={styles.itemRow} pointerEvents='box-only'>
                        <View style={[styles.flex1, styles.row]}>
                            <Icon name='plus' style={styles.marginRight} color={this.selectColor(IconColors.gray, Colors.white)} size={20} />
                            <Text style={[styles.text, this.isDark && styles.textDark]} numberOfLines={1}>
                                {Translator.trans('store-location.add-another', {}, 'mobile')}
                            </Text>
                        </View>
                        {isIOS && this.renderArrow()}
                    </View>
                </TouchableBackground>
                {this.renderBottomSeparator()}
            </>
        );
    }
}

export default AccountStoreLocations;
