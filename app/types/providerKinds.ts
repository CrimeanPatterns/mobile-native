export interface IProviderKind {
    KindID: number;
    Name: string;
    index: number;
    ad?: {
        description: string;
        image: string;
        link: {
            title: string;
            url: string;
        };
        title: string;
    };
    hidden?: boolean;
    Notice?: string;
}

export interface IProviderKinds {
    [index: string]: IProviderKind;
}
