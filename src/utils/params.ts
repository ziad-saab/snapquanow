import { StreamTokenPriceRequest, TokenPriceRequest } from "../types"

export function isValidGetTokenPriceRequest(params: unknown): asserts params is TokenPriceRequest {
  if (!(
    params != null &&
    typeof params === 'object' &&
    !Array.isArray(params) &&
    "token" in params &&
    // @ts-expect-error
    typeof params.token === 'string' &&
    "fiat" in params &&
    // @ts-expect-error
    typeof params.fiat === 'string' &&
    // @ts-expect-error
    ['USD', 'CAD'].includes(params.fiat)
  )) {
    throw new Error("Invalid getTokenPrice request")
  }
}

export function isValidStreamTokenPriceRequest(params: unknown): asserts params is StreamTokenPriceRequest {
  isValidGetTokenPriceRequest(params);
  if (!(
    "callback" in params &&
    // @ts-expect-error
    params.callback != null &&
    // @ts-expect-error
    typeof params.callback === 'object' &&
    // @ts-expect-error
    "snapId" in params.callback &&
    // @ts-expect-error
    typeof params.callback.snapId === 'string' &&
    // @ts-expect-error
    "method" in params.callback &&
    // @ts-expect-error
    typeof params.callback.method === 'string'
  )) {
    throw new Error("Invalid streamTokenPrice request")
  }
}