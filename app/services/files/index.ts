import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

const {DocumentDir, CacheDir} = RNFetchBlob.fs.dirs;

const rootDir = Platform.select({ios: DocumentDir, android: CacheDir});
const imagesDir = `${rootDir}/images`;

export const Dirs = {
    root: rootDir,
    images: imagesDir,
    temp: `${imagesDir}/temp`,
    attachments: `${imagesDir}/attachments`,
};
