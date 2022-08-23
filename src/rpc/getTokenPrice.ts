import { BestPrice, TokenPriceRequest } from "../types";

export const getTokenPrice = async ({ token, fiat }: TokenPriceRequest) => {
  try {
    const response = await fetch(`https://market.aquanow.io/bestprice?symbol=${token.toUpperCase()}-${fiat}`);
    const json = await response.json() as BestPrice;

    return (json.bestAsk + json.bestBid) / 2;
  } catch (err) {
    throw new Error('Unsupported token')
  }
}