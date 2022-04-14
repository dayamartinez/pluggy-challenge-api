import clientSanity from "../../config/dataset.config";
import querySanity from "../../constants/querySanity";
import getQuotes from "../../utils";
import quotes from "../models/quotes.model";
import slippage from "../models/slippgae.model";

class collectInfoController {
  static async collectInformation() {
    const { getQuotesOnAmbito, getQuotesOnCronista, getQuotesOnDolarHoy } =
      getQuotes;
    try {
      const { QUERY_AVERAGE, QUERY_SLIPPAGE, QUOTES_QUERY } = querySanity;
      const [ambitoResponse, dolarHoyResponse, cronistaResponse] =
        await Promise.all([
          getQuotesOnAmbito(),
          getQuotesOnDolarHoy(),
          getQuotesOnCronista(),
        ]);

      if (ambitoResponse && dolarHoyResponse && cronistaResponse) {
        const quotesType: string = "quotes";
        const averageType: string = "average";
        const slippageType: string = "slippage";

        const average_buy_price: number =
          (ambitoResponse.buy_price +
            dolarHoyResponse.buy_price +
            cronistaResponse.buy_price) /
          3;
        const average_sell_price: number =
          (ambitoResponse.sell_price +
            dolarHoyResponse.sell_price +
            cronistaResponse.sell_price) /
          3;

        const responseQuotesDB = await clientSanity.fetch(QUOTES_QUERY);

        if (!responseQuotesDB?.length) {
          //FIRSTIME
          const initialSlippage = {
            _type: slippageType,
            buy_price_slippage: 0,
            sell_price_slippage: 0,
          };

          await Promise.all([
            clientSanity.create({ _type: quotesType, ...ambitoResponse }),
            clientSanity.create({ _type: quotesType, ...dolarHoyResponse }),
            clientSanity.create({ _type: quotesType, ...cronistaResponse }),
            clientSanity.create({
              _type: averageType,
              average_buy_price,
              average_sell_price,
            }),
            clientSanity.create({
              ...initialSlippage,
              source: ambitoResponse.source,
            }),
            clientSanity.create({
              ...initialSlippage,
              source: ambitoResponse.source,
            }),
            clientSanity.create({
              ...initialSlippage,
              source: ambitoResponse.source,
            }),
          ]);
          return "Created successfy";
        }
        //FIND AND UPDATE
        //gets list of average and slippage
        const [responseAverageDB, responseSlippageDB] = await Promise.all([
          clientSanity.fetch(QUERY_AVERAGE),
          clientSanity.fetch(QUERY_SLIPPAGE),
        ]);

        //This function update slippage
        const findSlippage = async (
          source: string,
          buyPricePreview: number,
          buyPriceCurrent: number,
          sellPricePreview: number,
          sellPriceCurrent: number
        ) => {
          const diffBuyPrice = buyPriceCurrent - buyPricePreview;
          const diffSellPrice = sellPriceCurrent - sellPricePreview;
          let findedSlippage = responseSlippageDB?.find(
            (element: slippage) => element.source === source
          );
          if (findedSlippage) {
            await clientSanity
              .patch(findedSlippage._id)
              .set({
                buy_price: diffBuyPrice,
                sell_price: diffSellPrice,
              })
              .commit();
          }
        };

        //watch quotes - buy price and sell price if any change it update the quotes and slippage
        await responseQuotesDB.forEach(async (element: quotes) => {
          const { source, buy_price, sell_price, _id } = element;
          if (source === ambitoResponse.source) {
            if (
              buy_price !== ambitoResponse.buy_price ||
              sell_price !== ambitoResponse.sell_price
            )
              await findSlippage(
                source,
                buy_price,
                ambitoResponse.buy_price,
                sell_price,
                ambitoResponse.sell_price
              );

            await clientSanity
              .patch(_id)
              .set({
                buy_price: ambitoResponse.buy_price,
                sell_price: ambitoResponse.sell_price,
              })
              .commit();
          }
          if (source === dolarHoyResponse.source) {
            if (
              buy_price !== dolarHoyResponse.buy_price ||
              sell_price !== dolarHoyResponse.sell_price
            )
              await findSlippage(
                source,
                buy_price,
                dolarHoyResponse.buy_price,
                sell_price,
                dolarHoyResponse.sell_price
              );
            await clientSanity
              .patch(_id)
              .set({
                buy_price: dolarHoyResponse.buy_price,
                sell_price: dolarHoyResponse.sell_price,
              })
              .commit();
          }
          if (source === cronistaResponse.source) {
            if (
              buy_price !== cronistaResponse.buy_price ||
              sell_price !== cronistaResponse.sell_price
            )
              await findSlippage(
                source,
                buy_price,
                cronistaResponse.buy_price,
                sell_price,
                cronistaResponse.sell_price
              );
            await clientSanity
              .patch(_id)
              .set({
                buy_price: cronistaResponse.buy_price,
                sell_price: cronistaResponse.sell_price,
              })
              .commit();
          }
        });

        //updating average
        if (responseAverageDB.length) {
          const id = responseAverageDB[0]?._id;
          const updatedAverage = await clientSanity
            .patch(id)
            .set({
              average_buy_price,
              average_sell_price,
            })
            .commit();
          if (!updatedAverage) return "an error ocurred to updated average";
        }
        return "Updated successfy";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default collectInfoController;
