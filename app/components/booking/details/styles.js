import {Platform, StyleSheet} from 'react-native';

import {isTablet} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export const palette = {
    headerFill: Colors.grayLight,
    headerFillDark: DarkColors.bgLight,

    headerAngle1: Colors.gray,
    headerAngle1Dark: DarkColors.border,

    headerAngle2: Colors.white,
    headerAngle2Dark: Colors.white,

    headerAngle3: Colors.grayDark,
    headerAngle3Dark: DarkColors.bgLight,

    subheaderFill: Colors.grayLight,
    subheaderFillDark: DarkColors.bgLight,

    subheaderAngle1: Colors.gray,
    subheaderAngle1Dark: DarkColors.border,

    subheaderAngle2: Colors.grayLight,
    subheaderAngle2Dark: DarkColors.bgLight,

    subheaderIcon: Colors.grayDark,
    subheaderIconDark: Colors.white,
};

const baseHtmlStyles = {
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
    headerText: {
        marginRight: 5,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 20,
                color: palette.headerAngle3,
            },
            android: {
                fontSize: 18,
                color: Colors.gold,
            },
        }),
    },
    headerTextDark: {
        ...Platform.select({
            ios: {
                color: palette.headerAngle3Dark,
            },
            android: {
                color: DarkColors.gold,
            },
        }),
    },
    fieldNameText: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 15,
                color: Colors.grayDark,
            },
            android: {
                fontSize: 16,
                color: Colors.grayDarkLight,
            },
        }),
    },
    fieldValueText: {
        textAlign: 'right',
        paddingLeft: 5,
        ...Platform.select({
            android: {
                color: Colors.grayDark,
            },
        }),
    },
    noteText: {
        lineHeight: 15,
    },
};

let additionalHtmlStyles;

if (isTablet) {
    additionalHtmlStyles = {
        customHeaderText: {
            ...Platform.select({
                ios: {
                    color: Colors.white,
                },
                android: {
                    color: Colors.grayDarkLight,
                },
            }),
        },
    };
}

const htmlStyles = {
    ...baseHtmlStyles,
    ...additionalHtmlStyles,
};

const styles = {
    header: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 8,
        alignItems: 'flex-end',
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.borderGray,
                borderBottomWidth: 2,
                paddingHorizontal: 15,
                marginTop: 10,
            },
            android: {
                paddingHorizontal: 16,
                marginTop: 20,
            },
        }),
    },
    headerDark: {
        ...Platform.select({
            ios: {
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    headerArrow: {
        opacity: 0,
    },
    titleArrow: {
        opacity: 0,
    },
    field: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                minHeight: 50,
                paddingHorizontal: 15,
                paddingVertical: 10,
            },
            android: {
                minHeight: 40,
                marginLeft: 16,
                paddingRight: 16,
                paddingVertical: 5,
                borderTopColor: Colors.grayLight,
                borderTopWidth: 1,
            },
        }),
    },
    fieldDark: {
        ...Platform.select({
            android: {
                borderTopColor: DarkColors.border,
            },
        }),
    },
    fieldName: {
        maxWidth: '50%',
    },
    fieldNameText: {...htmlStyles.fieldNameText},
    fieldValue: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    fieldValueText: {...htmlStyles.fieldValueText},
    noteField: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                paddingVertical: 5,
                paddingHorizontal: 16,
            },
        }),
    },
    noteFieldName: {
        minWidth: '30%',
        paddingBottom: 10,
    },
    noteFieldValue: {
        maxWidth: '100%',
    },
    bold: {
        ...Platform.select({
            ios: {
                fontFamily: Fonts.bold,
                fontWeight: 'bold',
            },
        }),
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
    subheader: {
        backgroundColor: Colors.grayLight,
        ...Platform.select({
            ios: {
                paddingTop: 2,
                position: 'relative',
                borderBottomWidth: 1,
                borderBottomColor: palette.subheaderAngle1,
            },
            android: {
                marginBottom: -1,
            },
        }),
    },
    subheaderDark: {
        ...Platform.select({
            ios: {
                borderBottomColor: palette.subheaderAngle1Dark,
            },
        }),
    },
    subHeaderDark: {
        backgroundColor: DarkColors.bgLight,
        ...Platform.select({
            ios: {
                paddingTop: 0,
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    subheaderItem: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingHorizontal: 10,
        ...Platform.select({
            ios: {
                backgroundColor: palette.subheaderFill,
                minHeight: 40,
            },
            android: {
                minHeight: 34,
            },
        }),
    },
    subheaderItemDark: {
        ...Platform.select({
            ios: {
                backgroundColor: palette.subheaderFillDark,
            },
        }),
    },
    subHeaderItemDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    subheaderText: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                paddingLeft: 5,
                fontSize: 15,
                color: Colors.grayDark,
            },
            android: {
                paddingLeft: 6,
                fontSize: 16,
                color: Colors.grayDarkLight,
            },
        }),
    },
    subheaderIcon: {
        marginRight: 4,
    },
    tableRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
                marginRight: -16,
            },
        }),
    },
    tableCol: {
        ...Platform.select({
            ios: {
                paddingHorizontal: 5,
            },
            android: {
                paddingBottom: 8,
                paddingHorizontal: 0,
                borderBottomWidth: 1,
                borderBottomColor: Colors.grayLight,
            },
        }),
    },
    tableHeaderText: {
        color: Colors.grayDark,
    },
};

let additionalStyles;

if (isTablet) {
    additionalStyles = {
        headerWrap: {
            position: 'relative',
            paddingHorizontal: 0,
            ...Platform.select({
                ios: {
                    paddingVertical: 2,
                    borderTopWidth: 2,
                    borderTopColor: Colors.borderGray,
                    borderBottomWidth: 1,
                    borderBottomColor: palette.headerAngle1,
                },
                android: {
                    backgroundColor: Colors.grayLight,
                },
            }),
        },
        headerWrapDark: {
            borderTopWidth: 1,
            paddingVertical: 0,
            borderTopColor: DarkColors.border,
            borderBottomColor: DarkColors.border,
        },
        headerArrow: {
            ...Platform.select({
                ios: {
                    opacity: 1,
                },
                android: {
                    opacity: 0,
                },
            }),
        },
        title: {
            position: 'relative',
            width: '100%',
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            ...Platform.select({
                ios: {
                    backgroundColor: palette.headerAngle3,
                    height: 40,
                },
            }),
        },
        titleDark: {
            backgroundColor: DarkColors.bgLight,
        },
        titleArrow: {
            ...Platform.select({
                ios: {
                    opacity: 1,
                },
                android: {
                    opacity: 0,
                },
            }),
        },
    };
}

export {htmlStyles};
export default StyleSheet.create({...styles, ...additionalStyles});
