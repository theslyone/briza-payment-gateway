"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brizaCollect = exports.InstallmentFrequency = void 0;
const collect_js_1 = require("@vgs/collect-js");
const vgsVersion = '2.11.0';
const vaults = {
    test: 'tntep6suu1c',
    sandbox: 'tntwdbsm7ec',
    live: 'tntynnmpjnc',
};
var InstallmentFrequency;
(function (InstallmentFrequency) {
    InstallmentFrequency["Monthly"] = "monthly";
    InstallmentFrequency["Yearly"] = "yearly";
})(InstallmentFrequency = exports.InstallmentFrequency || (exports.InstallmentFrequency = {}));
async function brizaCollect(options) {
    const { environment, apiKeyOrToken, fields, css } = options;
    const collect = (await (0, collect_js_1.loadVGSCollect)({
        vaultId: vaults[environment],
        environment: environment === 'live' ? 'live' : 'sandbox',
        version: vgsVersion,
    }));
    let cardType = '';
    const vgsForm = collect.init((state) => {
        var _a, _b;
        cardType = `${(_b = (_a = state === null || state === void 0 ? void 0 : state['card-number']) === null || _a === void 0 ? void 0 : _a.cardType) !== null && _b !== void 0 ? _b : ''}`.toLocaleLowerCase();
    });
    const fieldConfigurations = [
        {
            type: 'text',
            name: 'card-name',
            placeholder: 'Credit Card Name',
            validations: ['required'],
            autoComplete: 'cc-name',
        },
        {
            type: 'card-number',
            name: 'card-number',
            placeholder: 'Credit Card Number',
            validations: ['required', 'validCardNumber'],
            autoComplete: 'cc-number',
            showCardIcon: {
                width: '35px',
                height: '22px',
            },
        },
        {
            type: 'card-security-code',
            name: 'card-security-code',
            placeholder: 'CVC',
            validations: ['required', 'validCardSecurityCode'],
            autoComplete: 'cc-csc',
            showCardIcon: {
                width: '35px',
                height: '22px',
            },
        },
        {
            type: 'card-expiration-date',
            name: 'card-expiration-date',
            placeholder: 'MM/YY',
            validations: ['required', 'validCardExpirationDate'],
            autoComplete: 'cc-exp',
            serializers: [
                vgsForm.SERIALIZERS.separate({
                    monthName: 'month',
                    yearName: 'year',
                }),
            ],
        },
    ];
    const fieldStates = [];
    const requiredFields = fieldConfigurations.map((field) => field.name);
    // check authorization mode is one of ApiKey or XToken
    if (!apiKeyOrToken.match(/^(sk-|.*\.t-).+$/)) {
        throw new Error(`invalid api key or token. Value must conform with Briza's ApiKey or XToken authorization scheme`);
    }
    // check all required fields are setup properly
    if (Object.keys(fields).length !== requiredFields.length ||
        !Object.keys(fields).every((field) => requiredFields.includes(field))) {
        throw new Error(`all fields in ${requiredFields.join(', ')} are required`);
    }
    for (const field of fieldConfigurations) {
        fieldStates.push(vgsForm.field(fields[field.name], {
            ...field,
            css,
        }).promise);
    }
    return {
        onReady: async () => Promise.all(fieldStates),
        reset: () => vgsForm.reset(),
        pay: async (quoteId, installmentFrequency) => {
            const authorization = apiKeyOrToken.startsWith('sk-')
                ? `ApiKey ${apiKeyOrToken}`
                : `XToken ${apiKeyOrToken}`;
            return new Promise((resolve, reject) => {
                vgsForm.submit('/post', {
                    method: 'POST',
                    headers: {
                        Authorization: authorization,
                        'content-type': 'application/json',
                    },
                    data: (formValues) => {
                        console.log('formValues', formValues);
                        return {
                            quoteId,
                            installmentFrequency,
                            paymentInfo: {
                                name: formValues['card-name'],
                                number: formValues['card-number'],
                                expiry: formValues['card-expiration-date'],
                                cvc: formValues['card-security-code'],
                                cardType,
                                method: 'vgs',
                                email: '',
                                address: {
                                    street: '',
                                    secondary: '',
                                    city: '',
                                    region: '',
                                    postalCode: '',
                                    county: '',
                                    country: 'US',
                                },
                            },
                        };
                    },
                }, (_, data) => resolve(data), reject);
            });
        },
    };
}
exports.brizaCollect = brizaCollect;
