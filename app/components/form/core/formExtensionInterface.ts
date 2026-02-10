export interface IFormExtension {
    onFieldChange(form: IFormExtension, fieldName: string): void;
    onFormReady(form: IFormExtension, fieldName: string): void;
    setValue(fieldName: string, value: unknown): void;
    getValue<T>(fieldName: string): T;
}

export default class FormExtensionInterface implements IFormExtension {
    setValue(_fieldName: string, _value: unknown): void {}

    onFieldChange(_form: IFormExtension, _fieldName: string): void {}

    onFormReady(_form: IFormExtension, _fieldName: string): void {}

    getValue<T>(_fieldName: string): T {
        return undefined as T;
    }
}
