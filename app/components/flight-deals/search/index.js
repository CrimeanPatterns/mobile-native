import {CancelToken} from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import API from '../../../services/api';
import {Colors, DarkColors} from '../../../styles';
import {useTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
// eslint-disable-next-line import/no-named-as-default
import {Modal} from '../../page/modal';
import SearchBar from '../../page/searchBar';
import Spinner from '../../spinner';
import FlightDealsSearchRow from './row';

class FlightDealsSearch extends BaseThemedPureComponent {
    static propTypes = {
        visible: PropTypes.bool,
        onClose: PropTypes.func,
        onChangeOrigin: PropTypes.func,
        theme: PropTypes.string,
        androidColor: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.modal = React.createRef();
        this.cancelToken = CancelToken.source();

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        this.onSearchChange = this.onSearchChange.bind(this);
        this.search = this.search.bind(this);
        this.search = _.debounce(this.search, 350);

        this.state = {
            query: '',
            result: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.cancelToken = null;
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    open() {
        if (this.modal.current) {
            this.modal.current.open();
        }
    }

    close() {
        if (this.modal.current) {
            this.modal.current.close();
        }
    }

    onClose = () => {
        const {onClose} = this.props;

        if (_.isFunction(onClose)) {
            onClose();
        }

        this.close();
    };

    async search(query) {
        if (query.length >= 3) {
            this.safeSetState({
                loading: true,
                result: null,
            });

            const response = await API.post(
                `/airport/find`,
                {
                    query,
                },
                {
                    cancelToken: this.cancelToken.token,
                },
            );

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data)) {
                    const {query} = this.state;

                    if (_.isArray(data)) {
                        let result = data;

                        if (_.isEmpty(query)) {
                            result = null;
                        }

                        this.setSearchResult({result});
                    }
                }
            }

            this.safeSetState({
                loading: false,
            });
        }
    }

    setSearchResult(response) {
        this.safeSetState(response);
    }

    onSearchChange(query) {
        this.safeSetState({query});

        if (this.cancelToken) {
            this.cancelToken.cancel();
            this.cancelToken = CancelToken.source();
        }

        if (query) {
            this.search(query);
        } else {
            this.setSearchResult({result: null});
        }
    }

    onChangeOrigin = (origin, airname) => {
        const {onChangeOrigin} = this.props;
        const {query} = this.state;

        onChangeOrigin(query, origin, airname);
    };

    renderHeader = () => {
        const {androidColor} = this.props;
        const {query, result, loading} = this.state;

        return (
            <>
                <SearchBar
                    autoFocus
                    // placeholder={Translator.trans('origin-airport', {}, 'promotions')}
                    placeholder='Origin Airport'
                    value={query}
                    onChangeText={this.onSearchChange}
                    autoCorrect={false}
                />
                {result === null && loading && <Spinner androidColor={androidColor} style={styles.spinner} />}
            </>
        );
    };

    renderItem = ({item}) => {
        const {airname, countryname, cityname, aircode} = item;
        const {theme} = this.props;
        const {query} = this.state;
        const isActive = query.toLowerCase() === aircode.toLowerCase();

        return (
            <FlightDealsSearchRow
                onChangeOrigin={this.onChangeOrigin}
                theme={theme}
                isActive={isActive}
                airname={airname}
                countryname={countryname}
                cityname={cityname}
                aircode={aircode}
            />
        );
    };

    renderSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    renderEmpty = () => null;

    keyExtractor = (item, index) => String(index);

    render() {
        const {theme} = this.props;
        const {result} = this.state;

        return (
            <Modal avoidKeyboard theme={theme} ref={this.modal} onClose={this.onClose}>
                {this.renderHeader()}
                <FlatList
                    data={result}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ListEmptyComponent={this.renderEmpty}
                    ItemSeparatorComponent={this.renderSeparator}
                    initialNumToRender={15}
                    keyboardShouldPersistTaps='always'
                />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    spinner: {
        marginVertical: 10,
        alignSelf: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
});

const ThemedFlightDealsSearch = React.forwardRef((props, ref) => {
    const theme = useTheme();

    return <FlightDealsSearch ref={ref} {...props} theme={theme} />;
});

ThemedFlightDealsSearch.displayName = 'ThemedFlightDealsSearch';

export default ThemedFlightDealsSearch;
