import {Text} from 'react-native';

const ScalableText = ({children, ...props}) => (
    <Text adjustsFontSizeToFit={true} numberOfLines={1} allowFontScaling={false} {...props}>
        {children}
    </Text>
);

export default ScalableText;
