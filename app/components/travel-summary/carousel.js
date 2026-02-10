import PropTypes from 'prop-types';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import BaseCarousel from 'react-native-snap-carousel';

import {isTablet} from '../../helpers/device';
import {getOrientation, LANDSCAPE} from '../../helpers/header';

function wp(percentage, viewportWidth) {
    const value = (percentage * viewportWidth) / 100;

    return Math.round(value);
}

class Carousel extends BaseCarousel {
    _setScrollHandler() {
        this._onScrollHandler = this._onScroll; // Hack for android & gesture scroll view
    }
}

function getCarouselSizes(viewportWidth, viewportHeight) {
    const slideHeight = viewportHeight * 0.36;
    const tabletWidth = getOrientation() === LANDSCAPE ? 45 : 55;
    const slideWidth = wp(isTablet ? tabletWidth : 85, viewportWidth);
    const itemHorizontalMargin = wp(3.5, viewportWidth);

    const sliderWidth = viewportWidth;
    const itemWidth = slideWidth + itemHorizontalMargin * 2;

    return {sliderWidth, slideHeight, itemWidth};
}

const AnimatedScrollView = ({...rest}) => <ScrollView {...rest} />; // fix android carousel

const CardCarousel = ({data, renderItem, onScrollIndexChanged}) => {
    const {width: viewportWidth, height: viewportHeight} = useWindowDimensions();
    const {sliderWidth, itemWidth} = getCarouselSizes(viewportWidth, viewportHeight);

    return (
        <Carousel
            data={data}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            hasParallaxImages={false}
            firstItem={0}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            loop={false}
            onScrollIndexChanged={onScrollIndexChanged}
            vertical={false}
            useScrollView={AnimatedScrollView}
        />
    );
};

CardCarousel.propTypes = {
    data: PropTypes.array,
    renderItem: PropTypes.func,
    onScrollIndexChanged: PropTypes.func,
};

export {CardCarousel};
