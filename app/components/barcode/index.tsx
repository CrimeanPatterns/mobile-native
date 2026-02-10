// @ts-ignore
import bwipjs from 'bwip-js/dist/bwip-js-rn.mjs';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, ImageStyle, ImageURISource, View} from 'react-native';

import {BarcodeType, BarcodeTypes} from './types';

const fixupBarcode = (format, code) => {
    if ([BarcodeTypes.UPC_A, BarcodeTypes.UPC, BarcodeTypes.UPC_E].includes(BarcodeTypes[format])) {
        if (code.length < 12) {
            // eslint-disable-next-line no-param-reassign
            code = `0${code}`;
        }
        if (code.length > 12) {
            // eslint-disable-next-line no-param-reassign
            code = code.substr(1);
        }
    }
    return code;
};

type BarcodeProps = {
    width: number;
    height: number;
    format: BarcodeType;
    value: string;
    lineColor?: string;
    barcodeStyle?: ImageStyle;
};

const Barcode: React.FunctionComponent<BarcodeProps> = ({width, height, format, value, lineColor, barcodeStyle}) => {
    const [image, setImage] = useState<ImageURISource | null>();
    const type = BarcodeTypes[format];
    const barcodeSizes = useMemo(() => {
        let [barcodeWidth, barcodeHeight] = [width, height];

        // @ts-ignore
        if ([BarcodeTypes.QR_CODE, BarcodeTypes.AZTECCODE].includes(type)) {
            let width = 150;

            if (value.length > 200) {
                width = 200;
            }
            if (value.length > 500) {
                width = 300;
            }
            barcodeWidth = width;
            barcodeHeight = barcodeWidth;
        }

        return {
            width: barcodeWidth,
            height: barcodeHeight,
        };
    }, [width, height, type, value.length]);

    useEffect(() => {
        async function getImage() {
            try {
                const {width, height} = barcodeSizes;

                const image = await bwipjs.toDataURL({
                    bcid: BarcodeTypes[format],
                    text: fixupBarcode(format, value),
                    width: width / 2.835,
                    height: height / 2.835,
                    scale: 3,
                    barcolor: lineColor || '000000',
                });

                setImage(image);
            } catch (e) {
                //
                console.log(e, value, format);
            }
        }

        setImage(null);
        getImage();
    }, [barcodeSizes, format, lineColor, value]);

    return (
        <View
            style={{
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                padding: 10,
                minHeight: barcodeSizes.height + 20,
            }}>
            {image && <Image style={{...barcodeSizes, ...barcodeStyle}} source={{uri: image.uri, width: image.width, height: image.height}} />}
        </View>
    );
};

export default Barcode;
