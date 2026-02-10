import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Svg} from 'react-native-svg';

export default class HeaderCorner extends PureComponent {
    static propTypes = {
        fill: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
    };

    render() {
        const {fill, children} = this.props;

        return (
            <Svg height={6} width={12} fill={fill} viewBox='0 0 100 50'>
                {children}
            </Svg>
        );
    }
}
