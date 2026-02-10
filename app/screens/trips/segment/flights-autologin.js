import React, {Component} from 'react';

import AutoLogin from '../../../components/autologin';
import Spinner from '../../../components/spinner';

class TimelineSegmentFlightsAutologin extends Component {
    static navigationOptions = ({route}) => {
        const loading = route?.params?.loading ?? false;

        return {
            title: '',
            headerTitle: () => loading && <Spinner />,
        };
    };

    _autoLogin = React.createRef();

    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
    }

    componentDidMount() {
        this.start();
    }

    get autoLogin() {
        return this._autoLogin.current;
    }

    start() {
        const {route} = this.props;
        const {Trip, Dates} = route?.params;

        this.autoLogin.showFlightStatus('kayak', {Trip, Dates});
    }

    onLoadStart() {
        const {navigation} = this.props;

        navigation.setParams({loading: true});
    }

    onLoadEnd() {
        const {navigation} = this.props;

        navigation.setParams({loading: false});
    }

    render() {
        return <AutoLogin ref={this._autoLogin} onLoadStart={this.onLoadStart} onLoadEnd={this.onLoadEnd} />;
    }
}

export default TimelineSegmentFlightsAutologin;
