import {Platform} from 'react-native';

function getAndroidStyles(primaryColor) {
    return {
        text: {
            primaryColor: {
                base: primaryColor,
            },
        },
        checkbox: {
            primaryColor: {
                base: primaryColor,
            },
        },
        switch: {
            primaryColor: {
                base: primaryColor,
            },
        },
        multipleChoice: {
            primaryColor: {
                base: primaryColor,
            },
        },
    };
}

export default function (primaryColor) {
    return {
        ...Platform.select({
            android: getAndroidStyles(primaryColor),
        }),
    };
}
