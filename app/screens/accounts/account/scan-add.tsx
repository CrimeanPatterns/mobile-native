import _ from 'lodash';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import Icon from '../../../components/icon';
import {isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import API from '../../../services/api';
import {useTheme} from '../../../theme';
import {FormDataResponse} from '../../../types/form';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';
import {BaseAccountAdd} from './add';

const TouchableRow = getTouchableComponent(TouchableOpacity);

class AccountScanAdd extends BaseAccountAdd {
    _getForm() {
        const {route} = this.props;
        const {promises, images} = route.params;
        const data = null;

        for (let k = 0, l = promises.length; k < l; k += 1) {
            promises[k].then(this.resolvePromise.bind(this, data, images, k, l - 1));
        }
    }

    loadForm() {
        const {route} = this.props;
        const {providerId} = route.params;

        API.get<{
            formData: FormDataResponse & {
                DisplayName;
                Kind;
            };
        }>(`/provider/${providerId}`).then((response) => {
            const {data} = response;

            if (_.isObject(data) && _.isObject(data.formData)) {
                const {DisplayName, Kind} = data;

                data.formData.children = this.updateFields(data.formData.children);

                this.setForm(data, DisplayName, Kind);
            }
        });
    }

    getForm() {
        const {route} = this.props;
        const {providerId} = route.params;

        if (_.isNil(providerId)) {
            return this._getForm();
        }

        return this.loadForm();
    }

    resolvePromise = (data, images, i, length, recognizeData) => {
        // fixes race condition, when second promise is resolved but the fields are empty
        this.safeSetState({}, () => {
            const {navigation, route} = this.props;
            const {
                side,
                response: {data: response},
            } = recognizeData;
            let DisplayName;
            let Kind;
            let {providerId} = route.params;
            let {fields} = this.state;

            images[side].CardImageId = response[side].CardImageId;

            if (!data || response.Kind !== 'custom') {
                // eslint-disable-next-line no-param-reassign
                data = response;
            }

            if (_.isObject(data)) {
                if ((data.Kind !== 'custom' || i === length) && fields === null) {
                    const {ProviderId} = data;

                    if (_.isNil(providerId) && !_.isNil(ProviderId)) {
                        providerId = ProviderId;
                        navigation.setParams({providerId});
                    }

                    if (_.isObject(data.formData)) {
                        if (_.isNil(fields)) {
                            fields = data.formData.children;
                        }

                        DisplayName = data.DisplayName;
                        Kind = data.Kind;
                        /* eslint-enable prefer-destructuring */
                    }
                }

                data.formData.children = this.updateFields(fields);

                this.setForm(data, DisplayName, Kind);
            }
        });
    };

    updateFields(fields) {
        const {route} = this.props;
        const {barcode, images} = route.params;

        // console.log(barcode, images);

        if (_.isArray(fields)) {
            for (let j = 0, field; j < fields.length; j += 1) {
                field = fields[j];
                if (field.type === 'card_images') {
                    for (const key in images) {
                        if (_.isObject(images[key])) {
                            field.value[key].CardImageId = images[key].CardImageId;
                            field.value[key].FileName = images[key].fileName;
                        }
                    }
                } else if (field.type === 'barcode' && _.isObject(barcode)) {
                    field.value = {
                        text: barcode.data,
                        format: barcode.type,
                    };
                }
            }
        }

        return fields;
    }

    changeProvider = () => {
        const {navigation, route} = this.props;

        navigation.navigate('AccountsAdd', {
            ...route.params,
            scan: true,
        });
    };

    renderHeader() {
        return (
            <TouchableRow onPress={this.changeProvider}>
                <>
                    {super.renderHeader()}
                    <View style={styles.iconContainer}>
                        <Icon name={(isIOS && 'small-arrow') || 'android-arrow_drop_down'} style={styles.arrow} size={24} />
                    </View>
                </>
            </TouchableRow>
        );
    }
}

const styles = StyleSheet.create({
    iconContainer: {
        position: 'absolute',
        right: 0,
        height: '100%',
        justifyContent: 'center',
    },
    arrow: {
        color: '#818a99',
    },
});

const AccountScanAddScreen: AccountsStackScreenFunctionalComponent<'AccountScanAdd'> = ({navigation, route}) => {
    const theme = useTheme();

    // @ts-ignore
    return <AccountScanAdd theme={theme} navigation={navigation} route={route} key={`account-scan-add` + route?.params?.providerId} />;
};

AccountScanAddScreen.navigationOptions = () => ({
    title: '',
});

export {AccountScanAddScreen};
