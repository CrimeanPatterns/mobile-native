import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import {Polygon} from 'react-native-svg';

import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import HTML from '../../html';
import HeaderCorner from './headerCorner';
import styles, {htmlStyles, palette} from './styles';

@withTheme
class Header extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        mainHeader: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
    };

    static defaultProps = {
        mainHeader: false,
    };

    render() {
        const {mainHeader, name, theme} = this.props;
        const baseFontStyle = {...htmlStyles.headerText, ...(this.isDark && htmlStyles.textDark)};

        if (mainHeader) {
            return (
                <View style={[styles.header, this.isDark && styles.headerDark]} accessible accessibilityLabel={name}>
                    <HTML key={`header_${theme}`} html={name} baseFontStyle={baseFontStyle} />
                </View>
            );
        }

        return (
            <View
                style={[styles.header, this.isDark && styles.headerDark, styles.headerWrap, this.isDark && styles.headerWrapDark]}
                accessible
                accessibilityLabel={name}>
                <View style={[styles.headerArrow, {position: 'absolute', bottom: -6, left: 16}]}>
                    <HeaderCorner fill={this.isDark ? palette.headerFillDark : palette.headerFill}>
                        <Polygon points='100,0 50,50 0,0' fill={this.isDark ? palette.headerAngle1Dark : palette.headerAngle1} />
                        <Polygon points='90,0 50,40 10,0' fill={this.isDark ? palette.headerAngle2Dark : palette.headerAngle2} />
                    </HeaderCorner>
                </View>
                <View style={[styles.title, this.isDark && styles.titleDark]}>
                    <View style={[styles.titleArrow, {position: 'absolute', bottom: -5, left: 16}]}>
                        <HeaderCorner fill={this.isDark ? palette.headerFillDark : palette.headerFill}>
                            <Polygon points='100,0 50,50 0,0' fill={this.isDark ? palette.headerAngle1Dark : palette.headerAngle3} />
                        </HeaderCorner>
                    </View>
                    <HTML
                        key={`header_${theme}`}
                        html={name}
                        baseFontStyle={{
                            ...baseFontStyle,
                            ...htmlStyles.customHeaderText,
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default Header;
