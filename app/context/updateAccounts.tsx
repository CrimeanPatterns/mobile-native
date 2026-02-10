import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {PropsWithChildren, useContext} from 'react';

interface IBottomSheetUpdateAccountsProvider {
    bottomSheetRef: React.RefObject<BottomSheetModalMethods> | null;
    presentBottomSheet: () => void;
    dismissBottomSheet: () => void;
}

export const BottomSheetUpdateAccountsContext = React.createContext<IBottomSheetUpdateAccountsProvider>({
    bottomSheetRef: null,
    presentBottomSheet: () => {},
    dismissBottomSheet: () => {},
});

export const BottomSheetUpdateAccountsProvider: React.FC<PropsWithChildren> = ({children}) => {
    const bottomSheetRef = React.createRef<BottomSheetModalMethods>();
    const presentBottomSheet = () => bottomSheetRef?.current?.present();
    const dismissBottomSheet = () => bottomSheetRef?.current?.dismiss();

    return (
        <BottomSheetUpdateAccountsContext.Provider value={{bottomSheetRef, presentBottomSheet, dismissBottomSheet}}>
            {children}
        </BottomSheetUpdateAccountsContext.Provider>
    );
};

export const useBottomSheetUpdateAccountsContext = () => useContext(BottomSheetUpdateAccountsContext);
