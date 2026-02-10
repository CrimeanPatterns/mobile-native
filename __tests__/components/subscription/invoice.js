import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

import {withDarkTheme, withLightTheme} from '../../__utils__/theme';
import PaymentInvoice from '../../../app/components/subscription/invoice';
import {isAndroid} from '../../../app/helpers/device';

const theme = {
    ...DefaultTheme,
    fonts: {},
};

const renderComponent = (children) => {
    if (isAndroid) {
        return render(<PaperProvider theme={theme}>{children}</PaperProvider>);
    }
    return render(children);
};

const defaultProps = {
    onContinue: jest.fn(),
    product: {
        desc: 'Test product description',
        priceWithoutDiscount: '999$',
        discountAmount: '99',
        discount: 99,
        price: '900$',
    },
    submitButtonColor: 'rgb(255, 255, 255)',
    customStyles: undefined,
};
const customStyles = {
    page: {
        backgroundColor: 'red',
    },
    container: {
        backgroundColor: 'blue',
    },
    text: {
        color: 'orange',
    },
    redText: {
        color: 'yellow',
    },
    row: {
        backgroundColor: '#ccc',
        borderColor: '#eee',
    },
};

it('<PaymentInvoice/>, light theme', () => {
    const field = renderComponent(withLightTheme(<PaymentInvoice {...defaultProps} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<PaymentInvoice/>, light theme, with customStyles', () => {
    const field = renderComponent(withLightTheme(<PaymentInvoice {...defaultProps} customStyles={customStyles} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<PaymentInvoice/>, dark theme', () => {
    const field = renderComponent(withDarkTheme(<PaymentInvoice {...defaultProps} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<PaymentInvoice/>, dark theme, with customStyles', () => {
    const darkStyles = {
        pageDark: {
            backgroundColor: 'redDark',
        },
        titleDark: {
            backgroundColor: 'white',
        },
        rowDark: {
            backgroundColor: '#000',
            borderColor: 'red',
        },
        textDark: {
            color: 'white',
        },
        redTextDark: {
            color: 'redDark',
        },
    };
    const field = renderComponent(withLightTheme(<PaymentInvoice {...defaultProps} customStyles={{...customStyles, ...darkStyles}} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<PaymentInvoice/>, press continue button', () => {
    const {getByTestId} = renderComponent(withLightTheme(<PaymentInvoice {...defaultProps} />));
    const button = getByTestId('submit');

    fireEvent(button, 'onPress');
    expect(defaultProps.onContinue).toHaveBeenCalledTimes(1);
});
