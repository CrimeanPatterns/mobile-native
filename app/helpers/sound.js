import Sound from 'react-native-sound';

export default {
    play(filename) {
        return new Promise((resolve, reject) => {
            const sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    reject(error);
                } else {
                    sound.play((success) => {
                        sound.release();
                        if (success) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            });
        });
    },
};
