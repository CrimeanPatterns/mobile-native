import React, {useCallback} from 'react';

import Title from './details/title';
import {Block} from './types';

type AlternativeFlightSegmentProps = {
    type: string;
    airline: string;
    blocks: Block[];
    price: string;
    value: number;
    active: boolean;
    onChange: () => void;
};

type IAlternativeFlightSegment = React.FunctionComponent<AlternativeFlightSegmentProps>;

const Components = {
    string: require('./details/string').default,
    dates: require('./details/dates').default,
    layover: require('./details/layover').default,
};

const AlternativeFlightSegment: IAlternativeFlightSegment = ({type, active, onChange, airline, blocks, price}) => {
    const renderItem = useCallback(({kind, ...props}, index) => {
        const Component = Components[kind];

        if (Component) {
            return <Component key={`${kind}-${index}`} {...props} />;
        }

        return null;
    }, []);

    return (
        <>
            <Title type={type} name={airline} value={price} checkbox={active} onPress={onChange} />
            {blocks.map(renderItem)}
        </>
    );
};

export default AlternativeFlightSegment;
