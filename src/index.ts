import { OnRpcRequestHandler, SnapProvider } from "@metamask/snap-types";
import { getTokenPrice } from "./rpc/getTokenPrice";
import { streamTokenPrice } from "./rpc/streamTokenPrice";
import { isValidGetTokenPriceRequest, isValidStreamTokenPriceRequest } from "./utils/params";

declare global {
  const wallet: SnapProvider;
}

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'getTokenPrice':
      isValidGetTokenPriceRequest(request.params);
      return getTokenPrice(request.params);
    case 'streamTokenPrice':
      isValidStreamTokenPriceRequest(request.params);
      return streamTokenPrice(request.params);
    default:
      throw new Error('Unsupported RPC method.');
  }
};

