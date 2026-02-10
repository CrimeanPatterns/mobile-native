import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import HTML from 'react-native-render-html';

import {Colors, DarkColors, Fonts} from '../../../styles';

const Paragraph = React.memo(({text, theme}) => {
    const styles = useMemo(
        () => ({
            containerStyle: {
                margin: 0,
                paddingHorizontal: 16,
                paddingVertical: 10,
            },

            tagsStyles: {
                p: {
                    margin: 0,
                    padding: 0,
                },
                rawtext: {
                    color: theme === 'dark' ? DarkColors.text : Colors.grayDark,
                },
            },
        }),
        [theme],
    );

    return (
        <HTML
            baseFontStyle={baseFontStyle}
            tagsStyles={styles.tagsStyles}
            containerStyle={styles.containerStyle}
            defaultTextProps={{
                selectable: true,
            }}
            source={{html: text}}
        />
    );
});

Paragraph.propTypes = {
    theme: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

const baseFontStyle = {
    fontSize: 16,
    fontFamily: Fonts.regular,
};

export default Paragraph;
