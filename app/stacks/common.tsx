import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import React from 'react';

import AboutUs from '../screens/static/aboutUs';
import ContactUs from '../screens/static/contactUs';
import FAQs from '../screens/static/faqs';
import InternalPage from '../screens/static/internal';
import PrivacyNotice from '../screens/static/privacy';
import Terms from '../screens/static/terms';
import {CommonRoutes} from '../types/navigation';

export const CommonScreens: {
    name: keyof CommonRoutes;
    component: React.ComponentType;
    options: NativeStackNavigationOptions;
}[] = [
    {name: 'AboutUs', component: AboutUs, options: AboutUs.navigationOptions},
    {name: 'PrivacyNotice', component: PrivacyNotice, options: PrivacyNotice.navigationOptions},
    {name: 'ContactUs', component: ContactUs, options: ContactUs.navigationOptions},
    {name: 'FAQs', component: FAQs, options: FAQs.navigationOptions},
    {name: 'Terms', component: Terms, options: Terms.navigationOptions},
    // @ts-ignore
    {name: 'InternalPage', component: InternalPage, options: InternalPage.navigationOptions},
];
