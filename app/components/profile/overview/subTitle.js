import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import {SeparatorArrow} from '../../page/crookedSeparator';
import styles from './styles';

class SubTitle extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        bold: PropTypes.bool,
        name: PropTypes.string.isRequired,
        testID: PropTypes.string,
    };

    render() {
        const {testID, name} = this.props;

        return (
            <View testID={testID} style={[styles.silver, this.isDark && styles.silverDark]} accessibilityLabel={name}>
                <View style={[styles.silverItem, this.isDark && styles.silverItemDark]}>
                    <Text style={[styles.silverText, this.isDark && styles.textDark]}>{isIOS ? name.toUpperCase() : name}</Text>
                </View>
                <SeparatorArrow style={{arrow: {top: null, bottom: -5}}} backgroundColor={this.selectColor(Colors.grayLight, DarkColors.bgLight)} />
            </View>
        );
    }
}

export default SubTitle;
