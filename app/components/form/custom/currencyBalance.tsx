import _ from 'lodash';
import React, {forwardRef, PropsWithChildren, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {ColorScheme} from '../../../theme';
import {IconCurrency} from '../../icon/currency';
// eslint-disable-next-line import/no-unresolved
import ChoiceField from '../field/choice';
// eslint-disable-next-line import/no-unresolved
import TextField from '../field/text';

class CurrencyChoiceField extends ChoiceField {
    private props: any;
    getStyles() {
        const baseStyles = super.getStyles();

        return StyleSheet.create({
            ...baseStyles,
            fieldContainer: {
                ...baseStyles.fieldContainer,
                justifyContent: 'flex-start',
                paddingStart: 10,
            },
            container: {
                ...baseStyles.container,
                paddingRight: 0,
                marginRight: 0,
            },
            fieldText: {
                ...baseStyles.fieldText,
                flex: 1,
                paddingStart: 6,
                paddingEnd: 0,
            },
        });
    }

    renderDropdownValue(props) {
        const {value: propValue, disabled, disabledValue, choices} = this.props;
        const value = this.getChoice(disabled && !_.isUndefined(disabledValue) ? disabledValue : propValue, choices);

        if (isIOS) {
            const styles = this.getStyles();

            return (
                <>
                    {value && <IconCurrency name={value} />}
                    <Text style={styles.fieldText} ellipsizeMode='tail'>
                        {value}
                    </Text>
                </>
            );
        }

        return super.renderDropdownValue({
            ...props,
            renderLeftAccessory: () =>
                value && (
                    <View style={{paddingRight: 5}}>
                        <IconCurrency name={value} />
                    </View>
                ),
        });
    }

    private getChoice(...args): string {
        return super.getChoice(...args);
    }
}

export const CurrencyBalance = forwardRef<
    View,
    PropsWithChildren<{
        theme: ColorScheme;
        onChangeValue: (value: {currency: string; balance: string}) => void;
    }>
>(({theme, children, onChangeValue}, ref) => {
    const [currency, setCurrency] = useState<string>(children?.[0].value);
    const [balance, setBalance] = useState<string>(children?.[1].value);

    useEffect(() => {
        if (_.isString(currency) && _.isString(balance)) {
            onChangeValue({
                currency,
                balance,
            });
        }
    }, [currency, balance]);

    return (
        <View style={{flexDirection: 'row'}} ref={ref}>
            <View style={{flex: 0.6}}>
                {/* @ts-ignore */}
                <CurrencyChoiceField {...children[0]} theme={theme} value={currency} onChangeValue={setCurrency} />
            </View>
            <View style={{flex: 1}}>
                {/* @ts-ignore */}
                <TextField {...children[1]} theme={theme} value={balance} onChangeValue={setBalance} />
            </View>
        </View>
    );
});
