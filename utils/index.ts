import axios from "axios";
import { chromium, firefox, webkit } from "playwright";

declare const process: {
  env: {
    API_AMBITO_DOLAR: string;
  };
};

const getQuotesOnAmbito = async () => {
  const apiExt = process.env.API_AMBITO_DOLAR;
  const {
    data: { compra: buyPrice, venta: sellPrice },
  } = await axios.get(apiExt);
  return { ambito: { sellPrice, buyPrice } }; //it will change when has db
};

const getQuotesOnDolarHoy = async (source: string) => {
  const browser = await chromium.launch({
    headless: false,
  });
  const page = await browser.newPage({
    bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
  });
  await page.goto(source);

  await page.waitForSelector("#sitio", { timeout: 30000 });

  let buyPrice = await page?.$eval(
    "div[class=compra] div[class=val]",
    (element) => element?.textContent
  );

  let sellPrice = await page?.$eval(
    "div[class=venta] div[class=val]",
    (element) => element?.textContent
  );
  await browser.close();
  return { dolarHoy: { sellPrice, buyPrice } }; //it will change when has db
};

const getQuotesOnCronista = async (source: string) => {
  const browser = await chromium.launch({
    headless: false,
  });
  const page = await browser.newPage({
    bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
  });
  await page.goto(source);
  await page.waitForSelector(".main-container", { timeout: 30000 });

  let buyPrice = await page?.$eval(
    "div[class=buy-value]",
    (ele) => ele?.textContent
  );

  let sellPrice = await page?.$eval(
    "div[class=sell-value]",
    (ele) => ele?.textContent
  );
  await browser.close();
  return { cronista: { sellPrice, buyPrice } }; //it will change when has db
};

export default { getQuotesOnAmbito, getQuotesOnCronista, getQuotesOnDolarHoy };
