import _ from 'lodash';
import React, {useCallback, useMemo, useState} from 'react';
import {Image, PixelRatio, StyleProp, View, ViewStyle} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {API_URL} from '../../../../services/api';
import {Colors, DarkColors} from '../../../../styles';
import {ColorSchemeDark, useTheme} from '../../../../theme';
import Icon from '../../../icon';
import Skeleton from '../../../page/skeleton';
import styles, {borderRadius} from './styles';

type ImageSize = {
    height?: number;
    width?: number;
};

type CreditCardImageProps = {
    name: string;
    isGranted?: boolean;
    onLoad?: () => void;
    onError?: () => void;
    style?: StyleProp<ViewStyle>;
} & ImageSize;

type CreditCardImageSkeletonProps = {
    style?: StyleProp<ViewStyle>;
} & ImageSize;

type ICreditCardImage = React.FunctionComponent<CreditCardImageProps>;

type ICreditCardImageSkeleton = React.FunctionComponent<CreditCardImageSkeletonProps>;

const pixelRatio = PixelRatio.get();

const CreditCardImage: ICreditCardImage = ({name, isGranted, height = 40, width = 63, onLoad: _onLoad, onError: _onError, style: _style}) => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const [isImage, setImage] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const iconColor = isIOS ? Colors.blue : Colors.green;
    const iconColorDark = isIOS ? DarkColors.blue : DarkColors.green;

    const uri = useMemo(() => _.replace(API_URL + name, /--(\w+)@(\d)x\.png/gm, `--${theme}@${pixelRatio}x.png`), [name, theme]);
    const dimensions = useMemo(() => ({height, width}), [height, width]);

    const onLoad = useCallback(() => {
        setIsLoading(false);
        if (_.isFunction(_onLoad)) {
            _onLoad();
        }
    }, [_onLoad]);

    const onError = useCallback(() => {
        setImage(false);
        if (_.isFunction(_onError)) {
            _onError();
        }
    }, [_onError]);

    return isImage ? (
        <View style={[styles.container, dimensions, _style]}>
            <Image
                key={`${name}-${theme}`}
                style={[styles.image, dimensions]}
                source={{
                    uri,
                }}
                onLoad={onLoad}
                onError={onError}
            />
            {!isLoading && isGranted && (
                <View style={[styles.iconGranted, isDark && styles.iconGrantedDark]}>
                    <Icon name='android-photo-check-blank' color={isDark ? iconColorDark : iconColor} size={12} />
                </View>
            )}
            {isLoading && <CreditCardImageSkeleton style={styles.skeleton} height={height} width={width} />}
        </View>
    ) : null;
};

const CreditCardImageSkeleton: ICreditCardImageSkeleton = ({height, width, style}) => (
    <Skeleton layout={[{key: 'image', height: height || 40, width: width || 63, borderRadius}]} style={style} />
);

export default CreditCardImage;
export {CreditCardImageSkeleton};
