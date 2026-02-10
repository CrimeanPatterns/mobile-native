import axios from 'axios';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import Icon from '../../../components/icon';
import SearchBar from '../../../components/page/searchBar';
import API from '../../../services/api';
import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {AccountAddListKind} from './listKind';
import styles from './styles';

@withTheme
class AccountAddListProvider extends AccountAddListKind {
    static navigationOptions = () => {
        const headerBackTitle = Translator.trans('buttons.back', {}, 'mobile');

        return {
            headerBackTitle,
            title: '',
        };
    };

    constructor(props) {
        super(props);

        this.cancelRequests = this.cancelRequests.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.search = this.search.bind(this);
        this.search = _.debounce(this.search, 350);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderEmpty = this.renderEmpty.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.state = {
            providers: [],
            search: null,
            error: null,
            loading: false,
        };

        this.requests = {
            get: axios.CancelToken.source(),
            post: axios.CancelToken.source(),
        };

        this.providers = [];
    }

    componentDidMount() {
        const {route} = this.props;

        if (route.params?.kindId) {
            this.getProviders(route.params?.kindId);
        }

        this._mounted = true;
    }

    componentWillUnmount() {
        this.cancelRequests();
        this._mounted = false;
    }

    getProviders(kindId) {
        this.setLoading(true);

        API.get(`/providers/${kindId}`, {
            cancelToken: this.requests.get.token,
        }).then(
            (response) => {
                const {data} = response;

                if (!this._mounted) {
                    return;
                }

                this.setLoading(false);

                if (_.isObject(data)) {
                    const {providers} = data;

                    if (providers) {
                        this.setSearchResult(data);
                        this.providers = providers;
                    }
                }
            },
            () => {},
        );
    }

    cancelRequests() {
        this.requests.get.cancel();
        this.requests.post.cancel();
    }

    setLoading(loading) {
        this.safeSetState({loading});
    }

    renderHeader = () => (
        <SearchBar
            tintColor={this.isDark ? DarkColors.blue : Colors.blue}
            value={this.state.search}
            onChangeText={this.onSearchChange}
            placeholder={Translator.trans('account.add.find-placeholder', {}, 'mobile')}
        />
    );

    renderEmpty = () => {
        const {error} = this.state;

        if (error && error.length > 0) {
            return (
                <View style={[styles.noFound, this.isDark && styles.noFoundDark]}>
                    <Icon name='warning' color={Colors.orange} size={24} />
                    <Text style={[styles.noFoundText, this.isDark && styles.textDark]}>{error}</Text>
                </View>
            );
        }

        return null;
    };
}

export default AccountAddListProvider;
