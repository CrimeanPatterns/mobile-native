import {useRef} from 'react';

export const useWillMount = (fn) => {
    const willMount = useRef(true);

    if (willMount.current && fn && typeof fn === 'function') {
        fn();
    }

    willMount.current = false;
};
