export interface TokenPriceRequest {
  token: string;
  fiat: "USD" | "CAD";
}

export interface StreamTokenPriceRequest extends TokenPriceRequest {
  callback: {
    snapId: string;
    method: string;
  }
}

export interface BestPrice {
  dataType: "aggBBO"
  lastUpdated: number
  symbol: string
  precisions: number[]
  bestBid: number
  bestAsk: number
  spread: number
}
