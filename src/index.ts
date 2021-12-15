import { loadVGSCollect } from '@vgs/collect-js';

const vgsVersion = '2.11.0'

type Environment = 'test' | 'sandbox' | 'live'

const vaults: Record<Environment, string> = {
  test: 'tntep6suu1c',  // 'tntnwaij64c',
  'sandbox': 'tntwdbsm7ec',
  'live': 'tntynnmpjnc'
}

type CreditCard = {
  cvc: string,
  name: string,
  number: string,
  expiry: string,
  cardType: string
}

export enum InstallmentFrequency {
  Monthly = 'monthly',
  Yearly = 'yearly'
}

type Payload = {
  quoteId: string
  installmentFrequency: InstallmentFrequency
  payment: CreditCard & { method: 'vgs' }
}

type FieldName = 'card-name' | 'card-number' | 'card-security-code' | 'card-expiration-date'
type Field = {
  name: FieldName
  type: 'text' | FieldName
  placeholder: string
  validations: string[]
  autoComplete: string
  showCardIcon?: Record<string, string>
}

type CSSFieldSelector<F extends FieldName = FieldName> = {
  [f in F]: string
}

type VGSCollect = {
  init: (callback?: (state: Record<FieldName, Record<string, unknown>>) => void) => VgsForm
}

type SuccessCallback = (status: number, data: Payload) => void
type ErrorCallback = (errors: Record<string, unknown>) => void

type VgsForm = {
  field: (selector: string, props: Record<string, unknown>) => { promise: Promise<unknown> }
  reset: () => void
  submit: (path: string, options: unknown, successCallback: SuccessCallback, errorCallback: ErrorCallback) => Promise<VgsForm>
}

type GatewayOptions = {
  environment: Environment
  token: string
  fields: CSSFieldSelector
  css?: Record<string, string>
}

async function brizaPaymentGateway(options: GatewayOptions) {
  const { environment, fields, css } = options
  const collect = (await loadVGSCollect({
    vaultId: vaults[environment],
    environment: environment === 'live' ? 'live' : 'sandbox',
    version: vgsVersion
  })) as VGSCollect

  let cardType = ''

  const vgsForm = collect.init((state) => {
    cardType = `${state?.['card-number']?.cardType ?? ''}`.toLocaleLowerCase()
  })

  const fieldConfigurations: Field[] = [
    {
      type: 'text',
      name: 'card-name',
      placeholder: 'Credit Card Name',
      validations: ['required'],
      autoComplete: "cc-name",
    },
    {
      type: 'card-number',
      name: 'card-number',
      placeholder: 'Credit Card Number',
      validations: ['required', 'validCardNumber'],
      autoComplete: "cc-number",
      showCardIcon: {
        width: "35px",
        height: "22px",
      }
    },
    {
      type: 'card-security-code',
      name: 'card-security-code',
      placeholder: 'CVC',
      validations: ['required', 'validCardSecurityCode'],
      autoComplete: "cc-csc",
      showCardIcon: {
        width: "35px",
        height: "22px",
      }
    },
    {
      type: 'card-expiration-date',
      name: 'card-expiration-date',
      placeholder: 'MM/YY',
      validations: ['required', 'validCardExpirationDate'],
      autoComplete: "cc-exp"
    }
  ]

  const fieldStates: Promise<unknown>[] = []

  const requiredFields = fieldConfigurations.map(field => field.name)

  if (
    Object.keys(fields).length !== requiredFields.length
    ||
    !(Object.keys(fields) as FieldName[]).every(field => requiredFields.includes(field))) {
    throw new Error(`all fields in ${requiredFields.join(', ')} are required`)
  }

  for (const field of fieldConfigurations) {
    fieldStates.push(vgsForm.field(fields[field.name], {
      ...field,
      css
    }).promise)
  }

  return {
    onReady: async () => Promise.all(fieldStates),
    reset: () => vgsForm.reset(),
    pay: async (quoteId: string, installmentFrequency: InstallmentFrequency) => {
      return new Promise<Payload>((resolve, reject) => {
        vgsForm.submit(
          '/post',
          {
            data: (formValues: Record<string, unknown>) => {
              return {
                quoteId,
                installmentFrequency,
                payment: {
                  name: formValues['card-name'],
                  cardType,
                  number: formValues['card-number'],
                  expiry: formValues['card-expiration-date'],
                  cvc: formValues['card-security-code'],
                  method: 'vgs'
                }
              }
            }
          },
          (_, data) => resolve(data),
          reject
        )
      })
    }
  }
}

export { brizaPaymentGateway }