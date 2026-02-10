import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

import {FlatList, RefreshableFlatList} from '../index';
import {AppleStyleSwipeableRow} from './AppleStyleSwipeableRow';

class SwipeableFlatList extends PureComponent {
    static propTypes = {
        keyExtractor: PropTypes.func,
        maxSwipeDistance: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
        renderItem: PropTypes.func,
        renderQuickActions: PropTypes.func,
        SwipeableRowComponent: PropTypes.any,
    };

    static defaultProps = {
        ...FlatList.defaultProps,
        renderQuickActions: () => null,
    };

    _getMaxSwipeDistance(info) {
        const {maxSwipeDistance} = this.props;

        if (typeof maxSwipeDistance === 'function') {
            return maxSwipeDistance(info);
        }

        return maxSwipeDistance;
    }

    renderItem = (info) => {
        const {SwipeableRowComponent = AppleStyleSwipeableRow, renderQuickActions, renderItem} = this.props;

        return (
            <SwipeableRowComponent
                renderQuickActions={(onClose) => renderQuickActions(info, onClose)}
                maxSwipeDistance={this._getMaxSwipeDistance(info)}>
                {renderItem(info)}
            </SwipeableRowComponent>
        );
    };

    render() {
        const {renderItem, ...rest} = this.props;

        return <RefreshableFlatList renderItem={this.renderItem} {...rest} />;
    }
}

export {SwipeableFlatList};
