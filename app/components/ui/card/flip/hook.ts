import {useContext} from 'react';

import {GestureFlipViewContext} from './context';

export const useGestureFlipView = () => {
    const context = useContext(GestureFlipViewContext);

    if (context === null) {
        throw "'useGestureFlipView' cannot be used out of the GestureFlipViewProvider!";
    }

    return context;
};
