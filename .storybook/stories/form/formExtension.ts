export const FormExtension = `
function addFormExtension(extension) {
    const fields = ['TestSecondLogin', 'TestPassword', 'TestExpirationDate', 'TestEliteLevel', 'TestComment', 'TestGoal'];

    function hideFields(form, visibleFields) {
        fields
            .filter((field) => !visibleFields.includes(field))
            .forEach(function (fieldName) {
                console.log('hideField', fieldName);
                form.showField(fieldName, false);
            });
    }

    extension.onFieldChange = function (form, fieldName) {
        console.log(fieldName, form.getValue(fieldName));
        if (fieldName === 'CustomBlock') {
            const visibleFields = form.getValue(fieldName).split(',');

            hideFields(form, visibleFields);
            visibleFields.forEach(function (fieldName) {
                form.showField(fieldName, true);
            });
        }
    };

    // @ts-ignore
    extension.onFormReady = function (form) {
        hideFields(form, []);
    };
}
`;
