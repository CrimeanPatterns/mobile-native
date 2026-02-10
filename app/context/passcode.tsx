import React, {useContext, useEffect, useMemo, useRef} from 'react';

import PasscodeAccess from '../screens/passcode/access';
import EventEmitter from '../services/eventEmitter';
import PasscodeService from '../services/passcode';

type PasscodeOpenCallback = () => void;

interface IPasscodeProvider {
    open: (callback: PasscodeOpenCallback) => void;
    isLocked: () => boolean;
}

export const PasscodeContext = React.createContext<IPasscodeProvider>({
    open: () => {},
    isLocked: () => false,
});
export const PasscodeConsumer = PasscodeContext.Consumer;
export const PasscodeProvider: React.FunctionComponent<
    React.PropsWithChildren<{
        initial?: boolean;
        onUnlock: () => void;
    }>
> = ({initial, onUnlock, children}) => {
    const ref = useRef<IPasscodeProvider>(null);
    const contextValue = useMemo(
        () => ({
            open: (cb) => ref.current?.open(cb),
            isLocked: () => ref.current?.isLocked() ?? false,
        }),
        [],
    );

    useEffect(() => {
        let listener;

        if (initial) {
            if (ref.current?.isLocked() === false) {
                onUnlock();
            } else {
                listener = EventEmitter.addListener('passcode:unlock', () => {
                    PasscodeService.resetPincodeAttempts();
                    onUnlock();
                    listener.remove();
                });
            }
        }

        return () => {
            if (listener) {
                listener.remove();
            }
        };
    }, []);

    return (
        <PasscodeContext.Provider value={contextValue}>
            <PasscodeAccess ref={ref} />
            {children}
        </PasscodeContext.Provider>
    );
};

export const usePasscodeContext = () => useContext(PasscodeContext);
