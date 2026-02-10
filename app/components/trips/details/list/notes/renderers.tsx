import React from 'react';
import {Text, View} from 'react-native';
import {constructStyles} from 'react-native-render-html/src/HTMLStyles';

function getTextProps(passProps) {
    const {selectable, allowFontScaling} = passProps;

    return {
        selectable,
        allowFontScaling,
    };
}

export function ul(htmlAttribs, children, convertedCSSStyles, passProps = {}) {
    const style = constructStyles({
        tagName: 'ul',
        htmlAttribs,
        passProps,
        styleSet: 'VIEW',
    });
    // @ts-ignore
    const {transientChildren, nodeIndex, key, baseFontStyle, listsPrefixesRenderers} = passProps;
    const baseFontSize = baseFontStyle.fontSize || 14;
    const textProps = getTextProps(passProps);

    // eslint-disable-next-line no-param-reassign
    children =
        children &&
        children.map((child, index) => {
            const rawChild = transientChildren[index];
            let prefix = false;
            const rendererArgs = [
                htmlAttribs,
                children,
                convertedCSSStyles,
                {
                    ...passProps,
                    nodeIndex: index,
                },
            ];

            if (rawChild) {
                if (rawChild.parentTag === 'ul' && rawChild.tagName === 'li') {
                    prefix =
                        listsPrefixesRenderers && listsPrefixesRenderers.ul ? (
                            listsPrefixesRenderers.ul(...rendererArgs)
                        ) : (
                            <View
                                style={{
                                    marginRight: 10,
                                    width: baseFontSize / 2.8,
                                    height: baseFontSize / 2.8,
                                    marginTop: baseFontSize / 2,
                                    borderRadius: baseFontSize / 2.8,
                                    backgroundColor: 'black',
                                }}
                            />
                        );
                } else if (rawChild.parentTag === 'ol' && rawChild.tagName === 'li') {
                    prefix =
                        listsPrefixesRenderers && listsPrefixesRenderers.ol ? (
                            listsPrefixesRenderers.ol(...rendererArgs)
                        ) : (
                            <Text {...textProps} style={{marginRight: 5, fontSize: baseFontSize}}>
                                {index + 1})
                            </Text>
                        );
                }
            }
            return (
                <View key={`list-${nodeIndex}-${index}-${key}`} style={{flexDirection: 'row'}}>
                    {prefix}
                    <View style={{flex: 1}}>{child}</View>
                </View>
            );
        });
    return (
        <View style={style} key={key}>
            {children}
        </View>
    );
}
