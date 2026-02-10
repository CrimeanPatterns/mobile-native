import React, {PureComponent} from 'react';
import {FlatList, SectionList} from 'react-native';

import ActionSheet from './actionSheet';
import HeaderButton from './header/button';
import HeaderMenuButton from './header/menuButton';
import BottomMenu from './menu';
import RefreshableFlatList from './refreshableFlatList';
import SearchBar from './searchBar';

function getDisplayName(OriginComponent) {
    return OriginComponent.displayName || OriginComponent.name || 'Component';
}

const withRefreshable = (ListComponent) => {
    class RefreshableList extends PureComponent {
        render() {
            return <RefreshableFlatList {...this.props} ListComponent={ListComponent} />;
        }
    }
    RefreshableList.displayName = `Refreshable${getDisplayName(ListComponent)}`;

    return RefreshableList;
};

class ExtendedSectionList extends SectionList {
    scrollToOffset(config) {
        // eslint-disable-next-line no-underscore-dangle
        this._wrapperListRef._listRef.scrollToOffset(config);
    }
}

const RefreshableSectionList = React.forwardRef((props, ref) => <RefreshableFlatList {...props} ListComponent={ExtendedSectionList} ref={ref} />);

export {HeaderMenuButton, HeaderButton, BottomMenu, ActionSheet, SearchBar, RefreshableFlatList, RefreshableSectionList, FlatList};
