import {Trip} from '../../list/trip';

class ShareTrip extends Trip {
    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        const {id, blocks, navigation, route} = this.props;
        const userAgentId = route?.params?.userAgentId;

        return (
            blocks &&
            blocks.length > 0 &&
            navigation.navigate('TimelineShareSegmentDetails', {
                id,
                userAgentId,
            })
        );
    }
}

export default ShareTrip;
