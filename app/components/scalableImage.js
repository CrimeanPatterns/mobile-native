import PropTypes from 'prop-types';
import React from 'react';
import {Image, ImageBackground, TouchableOpacity, View} from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

export default class ScalableImage extends React.Component {
    static getSize(sourceWidth, sourceHeight, props) {
        const {width, height, maxWidth, maxHeight} = props;

        let ratio = 1;

        if (!sourceWidth) {
            return {
                width: null,
                height: null,
            };
        }

        if (width && height) {
            ratio = Math.min(width / sourceWidth, height / sourceHeight);
        } else if (width) {
            ratio = width / sourceWidth;
        } else if (height) {
            ratio = height / sourceHeight;
        }

        // Deprecated stuff. Added the PR by mistake. You should use only width and height props
        if (maxWidth && sourceWidth * ratio > maxWidth) {
            ratio = maxWidth / sourceWidth;
        }

        if (maxHeight && sourceHeight * ratio > maxHeight) {
            ratio = maxHeight / sourceHeight;
        }

        return {
            width: sourceWidth * ratio,
            height: sourceHeight * ratio,
        };
    }

    constructor(props) {
        super(props);

        const {sourceWidth, sourceHeight, ...rest} = props;

        this.state = {
            size: ScalableImage.getSize(sourceWidth, sourceHeight, rest),
        };

        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    update() {
        const {source: sourceProps} = this.props;

        if (sourceProps) {
            if (sourceProps.uri) {
                const source = sourceProps.uri ? sourceProps.uri : sourceProps;

                Image.getSize(source, (width, height) => this.adjustSize(width, height), console.log);
            } else {
                const source = resolveAssetSource(sourceProps);

                this.adjustSize(source.width, source.height);
            }
        }
    }

    adjustSize(sourceWidth, sourceHeight) {
        const size = ScalableImage.getSize(sourceWidth, sourceHeight, this.props);

        if (this.mounted) {
            const {
                size: {width, height},
            } = this.state;

            if (width !== size.width || height !== size.height) {
                const {onSize} = this.props;

                this.setState(
                    {
                        size,
                    },
                    () => onSize(size),
                );
            }
        }
    }

    render() {
        const {background, source, style, onPress} = this.props;
        const {size} = this.state;
        const ImageComponent = background ? ImageBackground : Image;
        const image = <View style={[size]}>{source && source.uri && <ImageComponent {...this.props} style={[style, size]} />}</View>;

        if (!onPress) {
            return image;
        }

        return <TouchableOpacity onPress={onPress}>{image}</TouchableOpacity>;
    }
}

ScalableImage.propTypes = {
    background: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    maxHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    onPress: PropTypes.func,
    onSize: PropTypes.func,
    source: PropTypes.any,
    sourceHeight: PropTypes.any,
    sourceWidth: PropTypes.any,
    style: PropTypes.any,
};

ScalableImage.defaultProps = {
    background: false,
    onSize: () => {},
    width: null,
    height: null,
    maxWidth: null,
    maxHeight: null,
    sourceHeight: null,
    sourceWidth: null,
};
