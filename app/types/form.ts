export type FormDataResponse = {
    formTitle?: string;
    success?: boolean;
    next?: string;
    submitLabel?: string;
    error?: string;
    errors: string[];
    children: unknown[];
    needUpdate?: boolean;
    jsProviderExtension?: string;
};
