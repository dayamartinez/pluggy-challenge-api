import axios from "axios";
import { chromium } from "playwright-chromium";

declare const process: {
  env: {
    API_AMBITO_DOLAR: string;
    SOURCE_DOLAR_HOY: string;
    SOURCE_CRONISTA: string;
    SOURCE_AMBITO: string;
  };
};

const parseBuyPrice = (buy_price: string | null) =>
  parseFloat(buy_price!.slice(1).replace(",", "."));

const parseSellPrice = (sell_price: string | null) =>
  parseFloat(sell_price!.slice(1).replace(",", "."));

const getQuotesOnAmbito = async () => {
  try {
    const apiExt: string = process.env.API_AMBITO_DOLAR;
    const source: string = process.env.SOURCE_AMBITO;

    const {
      data: { compra, venta },
    } = await axios.get(apiExt);
    return {
      sell_price: parseFloat(venta),
      buy_price: parseFloat(compra),
      source,
    };
  } catch (err) {
    console.log(err);
  }
};

const getQuotesOnDolarHoy = async () => {
  try {
    const source: string = process.env.SOURCE_DOLAR_HOY;
    const browser = await chromium.launch({
      chromiumSandbox: false,
    });
    const page = await browser.newPage({
      bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
    });
    await page.goto(source);

    await page.waitForSelector("#sitio", { timeout: 30000 });

    let buy_price = await page?.$eval(
      "div[class=compra] div[class=val]",
      (element) => element?.textContent
    );

    let sell_price = await page?.$eval(
      "div[class=venta] div[class=val]",
      (element) => element?.textContent
    );
    await browser.close();
    return {
      sell_price: parseSellPrice(sell_price),
      buy_price: parseBuyPrice(buy_price),
      source,
    };
  } catch (err) {
    console.log(err);
  }
};

const getQuotesOnCronista = async () => {
  try {
    const source: string = process.env.SOURCE_CRONISTA;
    const browser = await chromium.launch({
      chromiumSandbox: false,
    });
    const page = await browser.newPage({
      bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
    });
    await page.goto(source);
    await page.waitForSelector(".main-container", { timeout: 30000 });

    let buy_price = await page?.$eval(
      "div[class=buy-value]",
      (ele) => ele?.textContent
    );

    let sell_price = await page?.$eval(
      "div[class=sell-value]",
      (ele) => ele?.textContent
    );
    await browser.close();
    return {
      sell_price: parseSellPrice(sell_price),
      buy_price: parseBuyPrice(buy_price),
      source,
    };
  } catch (err) {
    console.log(err);
  }
};

export default { getQuotesOnAmbito, getQuotesOnCronista, getQuotesOnDolarHoy };
