export default {
  QUOTES_QUERY: `*[_type == "quotes"] {buy_price, sell_price, source, _id, _updatedAt}`,
  QUERY_SLIPPAGE: `*[_type == "slippage"] {buy_price_slippage, sell_price_slippage, source, _id}`,
  QUERY_AVERAGE: `*[_type == "average"] {average_sell_price, average_buy_price, _id}`,
};
