# briza-collect

A VGS wrapper for Briza payment processing.

## Overview

This project provides an easy way to integrate Briza's payment processing without the need to worry about PCI compliance. Briza enforces a high level of data security by ensuring that all sensitive payment information are redacted before been `POST`ed to our quote payment and policy binding endpoint.

## Getting Started

#### Installing the dependency

- via NPM

```shell
$ npm i --save @briza/collect
```

- via CDN

```shell
$ <script src="..."></script>
```

## Usage

```js
let apiKeyOrToken = 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const environment = 'sandbox'

brizaCollect({
  apiKeyOrToken,
  environment,
  fields: {
    'card-name': '#cc-name',
    'card-number': '#cc-number',
    'card-expiration-date': '#cc-expiration-date',
    'card-security-code': '#cc-cvc',
  },
}).then(async (gateway) => {
  // wait for gateway ready state, consider using this to activate your submit button.
  await gateway.onReady()

  // post to make payment and bind a quote
  const result = await gateway.pay('quote-id', 'yearly')
})
```

### Keywords

[briza]() [payment]() [bind]()
