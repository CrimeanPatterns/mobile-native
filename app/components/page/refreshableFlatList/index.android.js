import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {FlatList, PlatformColor, RefreshControl} from 'react-native';

const DELAY_TIME = 3000;

class RefreshableFlatList extends PureComponent {
    static propTypes = {
        ListComponent: PropTypes.any,
        forceRefresh: PropTypes.bool,
        onRefresh: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ListComponent: FlatList,
        forceRefresh: false,
    };

    _scrollView = React.createRef();

    timeoutId = null;

    constructor(props) {
        super(props);

        this._handleOnRefresh = this._handleOnRefresh.bind(this);
        this._endLoading = this._endLoading.bind(this);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount() {
        const {forceRefresh} = this.props;

        this._mounted = true;
        if (forceRefresh) {
            this._forceRefresh();
        }
    }

    componentDidUpdate(prevProps) {
        const {forceRefresh} = this.props;
        const needRefresh = prevProps.forceRefresh !== forceRefresh && forceRefresh === true;

        if (needRefresh) {
            this._forceRefresh();
        }
    }

    componentWillUnmount() {
        this._mounted = false;
        clearTimeout(this.timeoutId);
    }

    scrollTo = (offset) => {
        this.scrollToOffset({offset, animated: true});
    };

    scrollToTop = () => {
        this.scrollToOffset({offset: 0, animated: true});
    };

    scrollToOffset = (...args) => {
        this._scrollView.current?.scrollToOffset(...args);
    };

    scrollToEnd = () => this._scrollView.current?.scrollToEnd();

    scrollToItem = (...args) => this._scrollView.current?.scrollToItem(...args);

    _forceRefresh() {
        this.setState(
            {
                isLoading: true,
            },
            () => {
                this._handleOnRefresh();
            },
        );
    }

    _delay() {
        return new Promise((resolve) => {
            this.timeoutId = setTimeout(resolve, DELAY_TIME);
        });
    }

    async _handleOnRefresh() {
        const {onRefresh} = this.props;

        this.setState({isLoading: true});

        try {
            if (_.isFunction(onRefresh)) {
                await onRefresh();
            }
        } finally {
            this._endLoading();
        }
    }

    _endLoading() {
        if (!this._mounted) {
            return;
        }

        this.setState({
            isLoading: false,
        });
    }

    render() {
        const {onRefresh, ListComponent, ...props} = this.props;
        const {isLoading} = this.state;

        return (
            <ListComponent
                ref={this._scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={this._handleOnRefresh}
                        colors={[PlatformColor('@color/refreshColor')]} // android/app/src/main/res/values/colors.xml:6
                        progressBackgroundColor={PlatformColor('@color/refreshBgColor')}
                    />
                }
                {...props}
            />
        );
    }
}

export default RefreshableFlatList;
