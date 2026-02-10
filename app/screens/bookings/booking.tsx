import _ from 'lodash';
import {AppState, NativeEventSubscription} from 'react-native';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import {isTablet} from '../../helpers/device';
import Sound from '../../helpers/sound';
import BookingService from '../../services/booking';
import EventEmitter, {EventSubscription} from '../../services/eventEmitter';

function generateDetailsKey(childKey, parentKey) {
    if (!parentKey) {
        return childKey;
    }

    return `${parentKey}-${childKey}`;
}

class Booking extends BaseThemedPureComponent {
    private listeners: (NativeEventSubscription | EventSubscription)[] = [];

    constructor(props) {
        super(props);

        this.state = {
            request: this.getRequest(),
            onlineUsers: null,
            appState: AppState.currentState,
            resending: false,
        };

        this.updateRequest = this.updateRequest.bind(this);
        this.onAppStateChange = this.onAppStateChange.bind(this);
        this.onChatStateChange = this.onChatStateChange.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.mounted = true;

        if (!this.requestId) {
            navigation.navigate('Bookings');
            return;
        }

        this.subscribe();
        this.sync();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.unsubscribe();

        BookingService.markAsRead(this.requestId);
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    get requestId() {
        const {route} = this.props;

        return parseInt(route.params?.requestId, 10);
    }

    getRequest() {
        if (!this.requestId) {
            return null;
        }

        const request = BookingService.getRequest(this.requestId);

        if (!request) {
            return null;
        }

        const {details, messages, ...rest} = request;
        const reverseMessages = Array.from(messages).reverse();

        return {
            ...rest,
            messages: reverseMessages,
            details: this.prepareBookingDetails(details),
        };
    }

    subscribe() {
        const {request} = this.state;

        this.listeners = [
            EventEmitter.addListener('booking:update', this.updateRequest),
            EventEmitter.addListener('booking:chat:join', this.onChatJoin),
            EventEmitter.addListener('booking:chat:leave', this.onChatLeave),
            AppState.addEventListener('change', this.onAppStateChange),
        ];

        if (request) {
            BookingService.subscribe(this.requestId, request.channels);
        }
    }

    unsubscribe() {
        const {request} = this.state;

        this.listeners.map((listener) => listener.remove());

        if (_.isObject(request)) {
            BookingService.unsubscribe(request.channels);
        }
    }

    updateRequest() {
        this.safeSetState({
            request: this.getRequest(),
        });
    }

    onChatStateChange({requestId, users: onlineUsers}, playSound = true) {
        if (this.requestId === parseInt(requestId, 10)) {
            this.safeSetState(
                {
                    onlineUsers,
                },
                () => {
                    if (playSound) {
                        Sound.play('online.mp3');
                    }
                },
            );
        }
    }

    onChatJoin = (response) => this.onChatStateChange(response);

    onChatLeave = (response) => this.onChatStateChange(response, false);

    onAppStateChange(nextAppState) {
        const {request, appState} = this.state;

        if (request) {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                BookingService.subscribe(this.requestId, request.channels);
            } else if (nextAppState === 'background') {
                BookingService.unsubscribe(request.channels);
            }
        }
        this.safeSetState({appState: nextAppState});
    }

    async sync() {
        try {
            await BookingService.sync(this.requestId);
            this.updateRequest();
        } catch (e) {
            // nothing
        }
    }

    prepareBookingDetails(details, blocks: unknown[] = [], parentKey = null) {
        if (_.isArray(details)) {
            details.forEach((field, i) => {
                const key = generateDetailsKey(`${field.type}_${i}`, parentKey);

                if (field.type === 'table') {
                    blocks.push({
                        field: {
                            type: 'tableRow',
                            row: field.headers,
                            header: true,
                        },
                        key: generateDetailsKey(`tableHeader_${i}`, parentKey),
                    });

                    field.rows.forEach((row, k) => {
                        blocks.push({
                            field: {
                                type: 'tableRow',
                                row,
                            },
                            key: generateDetailsKey(`tableRow_${i}_${k}`, parentKey),
                        });
                    });
                } else if (field.type !== 'toggle') {
                    // first block header
                    if (field.type === 'header' && _.isNull(parentKey) && i === 1) {
                        field.mainHeader = true;
                    }
                    blocks.push({
                        field,
                        key,
                    });
                } else if (isTablet && _.has(field, 'tablet')) {
                    this.prepareBookingDetails(field.tablet, blocks, key);
                } else if (_.has(field, 'phone')) {
                    this.prepareBookingDetails(field.phone, blocks, key);
                }
            });
        }

        return blocks;
    }
}

export default Booking;
