import getQuotes from "../../utils";

declare const process: {
  env: {
    SOURCE_DOLAR_HOY: string;
    SOURCE_CRONISTA: string;
  };
};

class collectInfoController {
  static async collectInformation() {
    const { getQuotesOnAmbito, getQuotesOnCronista, getQuotesOnDolarHoy } =
      getQuotes;
    try {
      const [ambitoResponse, dolarHoyResponse, cronistaResponse] =
        await Promise.all([
          getQuotesOnAmbito(),
          getQuotesOnDolarHoy(process.env.SOURCE_DOLAR_HOY),
          getQuotesOnCronista(process.env.SOURCE_CRONISTA),
        ]);

      if (ambitoResponse && dolarHoyResponse && cronistaResponse) {
        console.log({ ambitoResponse, dolarHoyResponse, cronistaResponse }); //it will change when It has db
        return;
      }
      console.log("No found data");
    } catch (error) {
      console.log(error);
    }
  }
}

export default collectInfoController;
