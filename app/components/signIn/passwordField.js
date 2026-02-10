import {PlainTextField} from './textField';

// Fix password generator
export class PasswordField extends PlainTextField {
    getPlainText() {
        const value = this.getValue();

        return Array(value.length).fill('\u25CF').join('');
    }
}
