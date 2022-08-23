import { BestPrice, StreamTokenPriceRequest } from "../types";

const UNAUTHORIZED_ERROR_CODE = 4100;

export const streamTokenPrice = (params: StreamTokenPriceRequest) => {
  return new Promise<null>((resolve, reject) => {
    
    const ws = new WebSocket("wss://market.aquanow.io/");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          channel: "gbbo",
          pair: `${params.token.toUpperCase()}-${params.fiat}`,
        }),
      )
    };

    let isRequestingPermission = false;
    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data.toString()) as BestPrice
        const midPoint = (data.bestAsk + data.bestBid) / 2

        try {
          // This is a hack. We're "streaming" data by calling the callback method provided by the invoking snap.
          // Ideally, we'd be able to also stream data directly from a Snap to a Dapp.
          const keepStreaming = await wallet.request({
            method: 'wallet_invokeSnap',
            params: [params.callback.snapId, {
              method: params.callback.method,
              params: {
                price: midPoint
              }
            }]
          });
          if (!keepStreaming) {
            ws.close();
            resolve(null);
          }
        } catch (err) {
          if (err.code === UNAUTHORIZED_ERROR_CODE) {
            if (!isRequestingPermission) {
              isRequestingPermission = true;
              await wallet.request({
                method: 'wallet_requestPermissions',
                params: [
                  {
                    [`wallet_snap_${params.callback.snapId}`]: {}
                  }
                ]
              });
              isRequestingPermission = false;
            }
          }
        }
      } catch (err) {
        ws.close();
        reject(err);
      }
    };

    ws.onclose = () => {
      resolve(null);
    }
  });
}
