import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {SectionList, Text, View} from 'react-native';

import {useDark} from '../../../theme';
import styles from './styles';

const SkeletonSectionList = React.memo(({length, sections, children, ItemSeparatorComponent, renderItem, ...props}) => {
    const isDark = useDark();

    const data = new Array(sections).fill({title: null, data: new Array(length).fill(null)});

    const keyExtractor = useCallback((item, index) => `skeleton-${index}`);

    const renderSeparator = useCallback(() => {
        if (_.isFunction(ItemSeparatorComponent)) {
            return ItemSeparatorComponent();
        }

        return ItemSeparatorComponent || <View style={[styles.separator, isDark && styles.separatorDark]} />;
    }, [ItemSeparatorComponent]);

    const renderItems = useCallback(
        (...props) => {
            if (_.isFunction(renderItem)) {
                return renderItem(...props);
            }

            return renderItem || children;
        },
        [renderItem],
    );

    return <SectionList sections={data} renderItem={renderItems} ItemSeparatorComponent={renderSeparator} keyExtractor={keyExtractor} {...props} />;
});

SkeletonSectionList.propTypes = {
    length: PropTypes.number,
    sections: PropTypes.number,
    children: PropTypes.object,
    renderSectionHeader: PropTypes.func,
    ItemSeparatorComponent: PropTypes.func,
};

export default SkeletonSectionList;
