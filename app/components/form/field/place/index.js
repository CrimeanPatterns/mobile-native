import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import RNGooglePlaces from 'react-native-google-places';

import CompletionField from '../completion';
import Text from '../text';

export default class Place extends PureComponent {
    static displayName = 'PlaceField';

    static propTypes = {
        ...Text.propTypes,
        locationBias: PropTypes.shape({
            latitudeNE: PropTypes.number,
            longitudeNE: PropTypes.number,
            latitudeSW: PropTypes.number,
            longitudeSW: PropTypes.number,
        }),
        value: PropTypes.shape({
            name: PropTypes.string,
            latitude: PropTypes.number,
            longitude: PropTypes.number,
        }),
        resultsType: PropTypes.string,
    };

    static defaultProps = {
        ...Text.defaultProps,
    };

    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            value: '',
            lookUpPlace: false,
            locationBias: props.locationBias,
        };

        this._handleInnerRef = this._handleInnerRef.bind(this);
        this._onChangeValue = this._onChangeValue.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._createRequest = this._createRequest.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    setLocationBias(locationBias) {
        this.setState({locationBias});
    }

    _handleInnerRef(ref) {
        const {innerRef = _.noop} = this.props;

        this._input = ref;
        innerRef(this._input);
    }

    _onChangeValue(value) {
        this.setState({value});
    }

    _onFocus() {
        const {onFocus = _.noop} = this.props;

        this.setState(
            {
                focused: true,
                value: '',
                lookUpPlace: false,
            },
            onFocus,
        );
    }

    _onBlur() {
        const {onBlur = _.noop} = this.props;

        this.setState(
            {
                focused: false,
            },
            onBlur,
        );
    }

    _createRequest(value) {
        const {resultsType: type} = this.props;
        const {locationBias} = this.state;
        const opts = {
            locationBias,
            ...(type ? {type} : {}),
        };

        return new Promise((resolve, reject) => {
            RNGooglePlaces.getAutocompletePredictions(value, opts)
                .then((results) => {
                    if (!_.isArray(results)) {
                        resolve([]);
                    } else {
                        resolve(
                            results.map((result) => ({
                                label: result.fullText,
                                value: result.fullText,
                                details: result,
                            })),
                        );
                    }
                })
                .catch((error) => {
                    console.log('RNGooglePlaces error', error.message);
                    reject(error.message);
                });
        });
    }

    _onSelect(completion) {
        const {onChangeValue = _.noop} = this.props;

        this.setState(
            {
                lookUpPlace: true,
            },
            () => {
                this._input.blur();

                RNGooglePlaces.lookUpPlaceByID(completion.details.placeID, ['address', 'location'])
                    .then((results) => {
                        onChangeValue({
                            name: completion.label,
                            latitude: _.get(results, 'location.latitude'),
                            longitude: _.get(results, 'location.longitude'),
                        });
                    })
                    .catch((error) => {
                        console.log('RNGooglePlaces error', error.message);
                    })
                    .finally(() => {
                        this.setState({lookUpPlace: false});
                    });
            },
        );
    }

    // eslint-disable-next-line class-methods-use-this
    formatValue(value) {
        if (!_.isObject(value)) {
            return null;
        }

        if (value.name) {
            return value.name;
        }
        if (value.latitude && value.longitude) {
            return `${value.latitude}, ${value.longitude}`;
        }

        return null;
    }

    render() {
        const {value, resultsType, ...rest} = this.props;
        const {focused, lookUpPlace, value: stateValue} = this.state;

        return (
            <CompletionField
                {...rest}
                innerRef={this._handleInnerRef}
                value={focused || lookUpPlace ? stateValue : this.formatValue(value)}
                onChangeValue={this._onChangeValue}
                onFocus={this._onFocus}
                onBlur={this._onBlur}
                createRequest={this._createRequest}
                onSelect={this._onSelect}
                wait={500}
                autoCorrect={false}
                clearTextOnFocus
            />
        );
    }
}
