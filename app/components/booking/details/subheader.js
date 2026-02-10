import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';
import {Polygon} from 'react-native-svg';

import {isIOS} from '../../../helpers/device';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import HeaderCorner from './headerCorner';
import styles, {palette} from './styles';

@withTheme
class Subheader extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        name: PropTypes.string.isRequired,
        icon: PropTypes.oneOf(['icon-user']),
    };

    render() {
        const {name, icon} = this.props;
        let iconName;

        if (icon === 'icon-user') {
            iconName = 'user';
        }

        return (
            <View style={[styles.subheader, this.isDark && styles.subHeaderDark]} accessibilityLabel={name}>
                {isIOS && (
                    <View style={{position: 'absolute', bottom: -6, left: 16}}>
                        <HeaderCorner fill={this.isDark ? palette.subheaderFillDark : palette.subheaderFill}>
                            <Polygon points='100,0 50,50 0,0' fill={this.isDark ? palette.subheaderAngle1Dark : palette.subheaderAngle1} />
                            <Polygon points='90,0 50,40 10,0' fill={this.isDark ? palette.subheaderAngle2Dark : palette.subheaderAngle2} />
                        </HeaderCorner>
                    </View>
                )}
                <View style={[styles.subheaderItem, this.isDark && styles.subHeaderItemDark]}>
                    {_.isString(iconName) && isIOS && <Icon name={iconName} color={palette.subheaderIcon} style={styles.subheaderIcon} size={24} />}
                    <Text style={[styles.subheaderText, this.isDark && styles.textDark]}>{isIOS ? name.toUpperCase() : name}</Text>
                </View>
            </View>
        );
    }
}

export default Subheader;
