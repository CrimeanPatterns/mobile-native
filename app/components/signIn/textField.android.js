import {TextField as MaterialTextField} from 'react-native-material-textfield';

import {TextField} from '../form';

export class TField extends MaterialTextField {
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/explicit-module-boundary-types
    renderTextInput() {
        return null;
    }
}

export class PlainTextField extends TextField {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    getTextFieldComponent() {
        const {editable} = this.props;

        if (!editable) {
            return TField;
        }

        return MaterialTextField;
    }
}
