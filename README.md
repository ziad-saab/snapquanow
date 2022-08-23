# Snapquanow &middot; ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg) [![npm version](https://img.shields.io/npm/v/snapquanow.svg?style=flat)](https://www.npmjs.com/package/snapquanow)

This MetaMask Snap is used to fetch or stream token pricing data from Aquanow.

## Exposed RPC methods:

### `getTokenPrice`:
This RPC method takes two string parameters, `token` and `fiat`, and returns the price of the token in the fiat currency selected. For the moment, the fiat currencies supported are `USD` and `CAD`. As an example, to get the price of ETH in USD:

```js
const response = await ethereum.request({
  method: 'wallet_invokeSnap',
  params: ['npm:snapquanow', {
    method: 'getTokenPrice',
    params: {
      token: 'ETH',
      fiat: 'USD'
    }
  }]
})
alert(`The current ETH price in USD is ${response.price}`);
```

### `streamTokenPrice` (experimental):
This RPC method is meant to be called from another Snap. It takes a `token` and `fiat` just like `getTokenPrice`, but additionally takes a `callback` parameter of the form `{snapId, method}`. It will then call your Snap's callback method repeatedly with the current price of the token, until your method returns `false`. Due to current limitations, this method can only be called from another Snap. Example:

```js
// From the calling Snap:
const ensureSnapquanowIsInstalled = async () => {
  await wallet.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          'npm:snapquanow': {},
        },
      },
    ],
  });
};

const callSnapquanow = async (method, params) => {
  await ensureSnapquanowIsInstalled();
  return wallet.request({
    method: 'wallet_invokeSnap',
    params: [
      'npm:snapquanow',
      {
        method,
        params,
      },
    ],
  });
};

module.exports.onRpcRequest = async ({ request }) => {
  switch (request.method) {
    case 'monitorEthereumPrice': {
      await callSnapquanow('streamTokenPrice', {
        token: 'ETH',
        fiat: 'USD',
        callback: {
          snapId: 'YOUR_SNAPS_ID',
          method: 'receiveEthereumPrice',
        },
      });

      return true;
    }
    case 'receiveEthereumPrice':
      console.log('Received ETH price', request.params);
      return true; // Keeps streaming forever. Use a more appropriate logic to decide when to stop streaming
    default:
      throw new Error('Method not found.');
  }
};
```