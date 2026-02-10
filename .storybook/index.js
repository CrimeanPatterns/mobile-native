import { getStorybookUI } from '@storybook/react-native';

import './storybook.requires';
import SplashScreen from "react-native-bootsplash";

SplashScreen.hide();

const StorybookUIRoot = getStorybookUI({});

export default StorybookUIRoot;
