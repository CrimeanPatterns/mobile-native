import Session from './session';

class Passcode {
    static getCode() {
        return Session.getProperty('pincode');
    }

    static setCode(code) {
        Session.setProperty('pincode', code);
        Passcode.resetPincodeAttempts();
    }

    static checkPasscode() {
        return Session.getProperty('pincode') !== null;
    }

    static skip() {
        Session.setProperty('pincode-skipped', true);
    }

    static isSkipped() {
        return Session.getProperty('pincode-skipped');
    }

    static pincodeAttempt() {
        const attempts = Passcode.getPincodeAttempts() + 1;

        Session.setProperty('pincode-attempts', attempts);
        return attempts;
    }

    static getPincodeAttempts() {
        return Session.getProperty('pincode-attempts') || 0;
    }

    static resetPincodeAttempts() {
        Session.setProperty('pincode-attempts', 0);
    }
}

export default Passcode;
