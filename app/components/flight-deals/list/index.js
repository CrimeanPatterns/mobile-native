import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import Icon from '../../icon';
import {FlatList} from '../../page';
import SearchBar from '../../page/searchBar';
import Spinner from '../../spinner';
import FlightDealsRow from './row';

class FlightDealsList extends PureComponent {
    static propTypes = {
        rows: PropTypes.array,
        loading: PropTypes.bool,
        handleLoadMore: PropTypes.func,
        openSearchModal: PropTypes.func,
        searchPlaceholder: PropTypes.string,
        theme: PropTypes.string,
        androidColor: PropTypes.string,
    };

    onEndReached = _.debounce(() => {
        const {handleLoadMore} = this.props;

        if (_.isFunction(handleLoadMore)) {
            handleLoadMore();
        }
    }, 250);

    get isDark() {
        const {theme} = this.props;

        return theme === 'dark';
    }

    openSearchModal = () => {
        const {openSearchModal} = this.props;

        if (_.isFunction(openSearchModal)) {
            openSearchModal();
        }
    };

    getItemLayout = (data, index) => ({length: 100, offset: 100 * index, index});

    renderItem = ({item}) => React.createElement(FlightDealsRow, item);

    renderSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    renderHeader = () => {
        const {rows, loading, searchPlaceholder, androidColor} = this.props;

        return (
            <>
                <TouchableOpacity activeOpacity={1} onPress={this.openSearchModal}>
                    <View style={styles.flex} pointerEvents='none'>
                        <SearchBar
                            editable={false}
                            // placeholder={Translator.trans('origin-airport', {}, 'promotions')}
                            placeholder='Origin Airport'
                            value={searchPlaceholder}
                            onChangeText={_.noop}
                            clearButtonMode='never'
                        />
                    </View>
                </TouchableOpacity>
                {loading && _.isEmpty(rows) && (
                    <View style={styles.spinnerContainer}>
                        <Spinner androidColor={androidColor} style={styles.spinner} />
                    </View>
                )}
            </>
        );
    };

    renderEmpty = () => {
        const {loading} = this.props;

        return (
            loading === false && (
                <View style={[styles.noFound, this.isDark && styles.noFoundDark]}>
                    <Icon name='warning' color={this.isDark ? DarkColors.orange : Colors.orange} size={24} />
                    <Text style={[styles.noFoundText, this.isDark && styles.textDark]}>No deals found</Text>
                </View>
            )
        );
    };

    keyExtractor = (item, index) => String(index);

    render() {
        const {rows} = this.props;
        const {height: screenHeight} = Dimensions.get('window');

        return (
            <FlatList
                style={[styles.page, this.isDark && styles.pageDark]}
                data={rows}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListEmptyComponent={this.renderEmpty}
                ListHeaderComponent={this.renderHeader}
                ItemSeparatorComponent={this.renderSeparator}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={screenHeight / 3}
                initialNumToRender={30}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='never'
                contentInsetAdjustmentBehavior='automatic'
                getItemLayout={this.getItemLayout}
            />
        );
    }
}

export default withTheme(FlightDealsList);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    spinner: {
        alignSelf: 'center',
    },
    spinnerContainer: {
        flex: 1,
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex: {
        flex: 1,
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        padding: 25,
    },
    noFoundText: {
        fontSize: 13,
        marginHorizontal: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
    },
});
