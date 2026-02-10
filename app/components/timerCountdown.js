/* eslint-disable no-undef */
import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Text} from 'react-native';

class TimerCountdown extends PureComponent {
    static propTypes = {
        date: PropTypes.number.isRequired,
    };

    static getTimeRemaining(dateEnd) {
        const diff = dateEnd - Date.now();

        function zero(value) {
            return Math.max(value, 0);
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return [diff, days, hours, minutes, seconds].map(zero);
    }

    constructor(props) {
        super(props);

        this.tick = this.tick.bind(this);
        this._tick = this._tick.bind(this);
        this._tick = _.throttle(this._tick, 1000);

        this.state = {
            time: null,
        };
    }

    componentDidMount() {
        this._mounted = true;
        this.tick();
    }

    componentWillUnmount() {
        this._mounted = false;
        cancelAnimationFrame(this.tick);
    }

    safeSetState(...args) {
        if (this._mounted) {
            this.setState(...args);
        }
    }

    formatTime = (hours, minutes, seconds) => [hours, minutes, seconds].map((value) => `0${value}`.slice(-2)).join(':');

    async tick() {
        await this._tick();
        requestAnimationFrame(this.tick);
    }

    async _tick() {
        const {date} = this.props;
        const [total, days, hours, minutes, seconds] = TimerCountdown.getTimeRemaining(new Date(date * 1000));
        const time = [];

        if (total !== 0 && days > 0) {
            time.push(Translator.transChoice('interval_short.days', days, {count: days}, 'messages'));
            time.push(Translator.trans('and.text', 'messages'));
        }

        time.push(this.formatTime(hours, minutes, seconds));

        await this.safeSetState({
            time: time.join(' '),
        });
    }

    render() {
        const {date, ...props} = this.props;
        const {time} = this.state;

        return <Text {...props}>{time}</Text>;
    }
}

export default TimerCountdown;
