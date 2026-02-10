import {useAccount} from '@hooks/account';
import {RouteProp} from '@react-navigation/native';
import {Colors, DarkColors} from "@styles/index";
import fromColor from 'color';
import _ from 'lodash';
import React, {createElement, PureComponent, useRef, useState} from 'react';
import {Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {interpolateColor, useAnimatedReaction, useAnimatedStyle} from 'react-native-reanimated';

import {isAndroid, isTablet} from '../../../helpers/device';
import {ColorScheme, ColorSchemeDark} from '../../../theme';
import {AccountsStackParamList} from '../../../types/navigation';
import CardImage from '../../accounts/details/cardImages/cardImage';
import {GestureFlipView} from '../../ui/card/flip/';
import {useGestureFlipView} from '../../ui/card/flip/hook';
import {ImageBlurShadow} from '../../ui/image/blur';
import {IForm} from '../index';

type ImageValue = Record<'Front' | 'Back', {FileName?: string; Label: string; Url?: string; CardImageId?: number}>;

const AnimatedImage = (props) => {
    const {flipValue, startValue} = useGestureFlipView();
    const {shadowBackgroundColor} = props;
    const colorArr = fromColor(shadowBackgroundColor).array();
    const color = `rgba(${colorArr.join(',')}, 0)`;
    const transparentColor = `rgba(${colorArr.join(',')}, 1)`;
    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            flipValue.value,
            [startValue.value - 0.5, startValue.value, startValue.value + 0.5],
            [transparentColor, color, transparentColor],
        ),
    }));

    return <ImageBlurShadow {...props} animatedShadowStyle={animatedStyle} />;
};

class FormCardImage extends CardImage {
    renderImage() {
        // @ts-ignore
        const {filePath, imageWidth: width, imageHeight: height} = this.state;

        return (
            <AnimatedImage
                // @ts-ignore
                shadowBackgroundColor={this.isDark ? DarkColors.bg : Colors.grayLight}
                shadowBlurRadius={50}
                shadowOffset={40}
                imageBorderRadius={10}
                imageWidth={width}
                imageHeight={height}
                source={{uri: `file://${filePath}`, width, height}}
            />
        );
    }

    renderEmptyContent() {
        return (
            <>
                {super.renderEmptyContent()}
                <View style={{height: 40}} />
            </>
        );
    }
}

type FormCardImagesProps = {
    theme: ColorScheme;
    route: RouteProp<AccountsStackParamList, 'AccountEdit'>;
    form: IForm;
    name: string;
    value: ImageValue;
};

const FormCardImages: React.FunctionComponent<FormCardImagesProps> = ({theme, route, form, name, value: images}) => {
    const windowDimensions = useWindowDimensions();
    const isDark = theme === ColorSchemeDark;
    const {ID, SubAccountID} = route.params;
    const flipCardRef = useRef<GestureFlipView>(null);
    const [activeCardFace, setActiveCardFace] = useState(0);
    const {account} = useAccount(ID, SubAccountID);
    const onFlip = (index: number) => {
        setActiveCardFace(index);
    };
    const onCapture = () => {
        setTimeout(() => {
            flipCardRef.current?.flipLeft();
        }, 500);
    };
    const onUpload = (data: {side: string; fileName: string; CardImageId: number}) => {
        const {side, fileName, CardImageId} = data;
        const value = form.getValue<ImageValue>(name);

        if (_.isObject(value)) {
            value[side].CardImageId = CardImageId;
            value[side].FileName = fileName;

            form.setValue(name, value);
        }
    };
    const onRemove = (side) => {
        const value = form.getValue(name);

        if (_.isObject(value)) {
            value[side].CardImageId = null;
            value[side].FileName = null;
            value[side].Url = null;

            form.setValue(name, value);
        }
    };
    const renderCardImage = (imageData) => {
        const [side, image] = imageData;

        const {FileName: fileName, Label: label, Url: url, CardImageId: id} = image;
        const rest: {
            accountId?: string;
            canRemove: boolean;
        } = {
            accountId: undefined,
            canRemove: false,
        };

        if (account) {
            const accountId = route?.params?.ID;
            const {Access} = account;

            rest.accountId = accountId;
            rest.canRemove = (Access && Access.delete) || false;
        }

        // @ts-ignore
        return createElement(FormCardImage, {
            theme,
            key: side,
            side,
            fileName,
            label,
            url,
            id: String(id),
            onRemove,
            onUpload,
            onCapture,
            ...rest,
        });
    };

    const viewDimensions = CardImage.getClientImageSize(windowDimensions.width);

    return (
        <View style={[style.container, isDark && style.containerDark]}>
            <View
                style={[
                    style.card,
                    isAndroid && {
                        backgroundColor: !isDark ? Colors.grayLight : DarkColors.bg,
                        borderTopColor: !isDark ? Colors.gray : DarkColors.border,
                    },
                ]}>
                <View style={{position: 'relative'}}>
                    <GestureFlipView ref={flipCardRef} onFlip={onFlip} width={viewDimensions.imageWidth} height={viewDimensions.imageHeight}>
                        {_.isObject(images) && Object.entries(images).map(renderCardImage)}
                    </GestureFlipView>
                    <View style={style.dotsContainer}>
                        {[0, 1].map((value) => (
                            <View key={`dot-${value}`} style={[style.dot, value === activeCardFace && style.dotActive]} />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.grayLight,
    },
    containerDark: {
        backgroundColor: DarkColors.bg,
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        ...(isTablet
            ? {
                  flexDirection: 'row',
              }
            : {}),
        ...Platform.select({
            android: {
                marginHorizontal: -16,
                paddingHorizontal: 16,
                paddingBottom: 16,
            },
        }),
    },
    dotsContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    dot: {
        marginHorizontal: 3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.gray,
    },
    dotActive: {
        backgroundColor: Colors.blue,
    },
});

export default class FormCardImagesClass extends PureComponent<FormCardImagesProps> {
    render() {
        return <FormCardImages {...this.props} />;
    }
}
