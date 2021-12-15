# briza-collect

A VGS wrapper for Briza payment processing.

<img width="800" alt="Screenshot 2021-08-13 at 10 50 05" src="https://user-images.githubusercontent.com/15334332/146255220-d5b0f260-7ac4-4a9d-99a7-7734c0ac0fc5.gif">

## Overview

This project provides an easy way to integrate Briza's payment processing without the need to worry about PCI compliance. Briza enforces a high level of data security by ensuring all sensitive payment information are redacted and securely proxied to third party payment processors.

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

[briza-api](https://briza-api.redoc.ly/), [bind](https://briza-api.redoc.ly/#operation/patchPolicyhttps://briza-api.redoc.ly/)
