import Session from './session';

class Intro {
    static TWO_WEEKS = 3600 * 24 * 14 * 1000;

    static performedIntro() {
        Session.setProperty('intro-performed', Date.now());
    }

    static checkPerformedIntro() {
        const dateCurrent = Date.now();
        const datePerformed = Session.getProperty('intro-performed');
        const datePassed = dateCurrent >= datePerformed + this.TWO_WEEKS;

        return !!datePerformed && !datePassed;
    }

    static performedNotifications() {
        Session.setProperty('notifications-intro-performed', true);
    }

    static checkPerformedNotifications() {
        if (!this.checkPerformedIntro()) {
            return false;
        }

        return !!Session.getProperty('notifications-intro-performed');
    }

    static performedLocation() {
        Session.setProperty('location-intro-performed', true);
    }

    static checkPerformedLocation() {
        if (!this.checkPerformedIntro()) {
            return false;
        }

        return !!Session.getProperty('location-intro-performed');
    }

    static performedPasscode() {
        Session.setProperty('passcode-intro-performed', true);
    }

    static checkPerformedPasscode() {
        if (!this.checkPerformedIntro()) {
            return false;
        }

        return !!Session.getProperty('passcode-intro-performed');
    }
}

export default Intro;
