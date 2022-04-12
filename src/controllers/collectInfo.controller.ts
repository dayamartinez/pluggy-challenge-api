import clientSanity from "../../config/dataset.config";
import getQuotes from "../../utils";
import quotes from "../models/quotes.model";
import slippage from "../models/slippgae.model";

class collectInfoController {
  static async collectInformation() {
    const { getQuotesOnAmbito, getQuotesOnCronista, getQuotesOnDolarHoy } =
      getQuotes;
    try {
      const [ambitoResponse, dolarHoyResponse, cronistaResponse] =
        await Promise.all([
          getQuotesOnAmbito(),
          getQuotesOnDolarHoy(),
          getQuotesOnCronista(),
        ]);

      if (ambitoResponse && dolarHoyResponse && cronistaResponse) {
        const queryQuotes: string = `*[_type == "quotes"] {buy_price, sell_price, source, _id}`;

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

        const responseQuotesDB = await clientSanity.fetch(queryQuotes);

        if (!responseQuotesDB?.length) {
          //FIRSTIME
          const initialSlippage = {
            _type: slippageType,
            buy_price_slippage: 0,
            sell_price_slippage: 0,
          };

          await clientSanity.create({ _type: quotesType, ...ambitoResponse });
          await clientSanity.create({ _type: quotesType, ...dolarHoyResponse });
          await clientSanity.create({ _type: quotesType, ...cronistaResponse });

          await clientSanity.create({
            _type: averageType,
            average_buy_price,
            average_sell_price,
          });

          await clientSanity.create({
            ...initialSlippage,
            source: ambitoResponse.source,
          });
          await clientSanity.create({
            ...initialSlippage,
            source: ambitoResponse.source,
          });
          await clientSanity.create({
            ...initialSlippage,
            source: ambitoResponse.source,
          });
          return "Created successfy";
        }
        //FINDED
        const queryAverage: string = `*[_type == "average"] {average_sell_price, average_buy_price, _id}`;
        const querySlippage: string = `*[_type == "slippage"] {buy_price_slippage, sell_price_slippage, source, _id}`;

        const responseAverageDB = await clientSanity.fetch(queryAverage);
        const responseSlippageDB = await clientSanity.fetch(querySlippage);

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
