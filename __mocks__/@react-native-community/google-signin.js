export const signInResponse = {
    scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
    ],
    refreshToken: 'refreshToken',
    serverAuthCode: 'serverAuthCode',
    accessToken: 'accessToken',
    accessTokenExpirationDate: 3598.9999,
    idToken: 'idToken',
    user: {
        givenName: 'givenName',
        email: 'email@awardwallet.com',
        id: 'id',
        familyName: 'familyName',
        photo: 'https://lh3.googleusercontent.com/photo',
        name: 'name',
    },
};

export const GoogleSignin = {
    configure: jest.fn(),
    signOut: jest.fn(),
    signIn: jest.fn(() => signInResponse),
};
