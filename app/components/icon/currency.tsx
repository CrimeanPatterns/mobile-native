import React, {lazy} from 'react';
import {View} from 'react-native';

const icons = {
    usd: lazy(() => import(`../../assets/currency/usd.svg`)),
    aud: lazy(() => import(`../../assets/currency/aud.svg`)),
    brl: lazy(() => import(`../../assets/currency/brl.svg`)),
    cad: lazy(() => import(`../../assets/currency/cad.svg`)),
    chf: lazy(() => import(`../../assets/currency/chf.svg`)),
    cny: lazy(() => import(`../../assets/currency/cny.svg`)),
    crc: lazy(() => import(`../../assets/currency/crc.svg`)),
    eur: lazy(() => import(`../../assets/currency/eur.svg`)),
    gbp: lazy(() => import(`../../assets/currency/gbp.svg`)),
    hkd: lazy(() => import(`../../assets/currency/hkd.svg`)),
    inr: lazy(() => import(`../../assets/currency/inr.svg`)),
    jpy: lazy(() => import(`../../assets/currency/jpy.svg`)),
    krw: lazy(() => import(`../../assets/currency/krw.svg`)),
    nok: lazy(() => import(`../../assets/currency/nok.svg`)),
    rub: lazy(() => import(`../../assets/currency/rub.svg`)),
    sgd: lazy(() => import(`../../assets/currency/sgd.svg`)),
    thb: lazy(() => import(`../../assets/currency/thb.svg`)),
    myr: lazy(() => import(`../../assets/currency/myr.svg`)),
    points: lazy(() => import(`../../assets/currency/points.svg`)),
    miles: lazy(() => import(`../../assets/currency/miles.svg`)),
    kms: lazy(() => import(`../../assets/currency/kilometers.svg`)),
};

export const IconCurrency: React.FunctionComponent<{name: string}> = ({name}) => {
    const LazyIcon = icons[name.toLowerCase()];

    return <View style={{width: 24, height: 24}}>{LazyIcon && <LazyIcon />}</View>;
};
