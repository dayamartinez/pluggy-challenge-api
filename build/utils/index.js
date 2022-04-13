"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const playwright_1 = require("playwright");
const parseBuyPrice = (buy_price) => parseFloat(buy_price.slice(1).replace(",", "."));
const parseSellPrice = (sell_price) => parseFloat(sell_price.slice(1).replace(",", "."));
const getQuotesOnAmbito = () => __awaiter(void 0, void 0, void 0, function* () {
    const apiExt = process.env.API_AMBITO_DOLAR;
    const source = process.env.SOURCE_AMBITO;
    const { data: { compra, venta }, } = yield axios_1.default.get(apiExt);
    return {
        sell_price: parseFloat(compra),
        buy_price: parseFloat(venta),
        source,
    };
});
const getQuotesOnDolarHoy = () => __awaiter(void 0, void 0, void 0, function* () {
    const source = process.env.SOURCE_DOLAR_HOY;
    const browser = yield playwright_1.chromium.launch({
        headless: false,
    });
    const page = yield browser.newPage({
        bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
    });
    yield page.goto(source);
    yield page.waitForSelector("#sitio", { timeout: 30000 });
    let buy_price = yield (page === null || page === void 0 ? void 0 : page.$eval("div[class=compra] div[class=val]", (element) => element === null || element === void 0 ? void 0 : element.textContent));
    let sell_price = yield (page === null || page === void 0 ? void 0 : page.$eval("div[class=venta] div[class=val]", (element) => element === null || element === void 0 ? void 0 : element.textContent));
    yield browser.close();
    return {
        sell_price: parseSellPrice(sell_price),
        buy_price: parseBuyPrice(buy_price),
        source,
    };
});
const getQuotesOnCronista = () => __awaiter(void 0, void 0, void 0, function* () {
    const source = process.env.SOURCE_CRONISTA;
    const browser = yield playwright_1.chromium.launch({
        headless: false,
    });
    const page = yield browser.newPage({
        bypassCSP: true, // This is needed to enable JavaScript execution on GitHub.
    });
    yield page.goto(source);
    yield page.waitForSelector(".main-container", { timeout: 30000 });
    let buy_price = yield (page === null || page === void 0 ? void 0 : page.$eval("div[class=buy-value]", (ele) => ele === null || ele === void 0 ? void 0 : ele.textContent));
    let sell_price = yield (page === null || page === void 0 ? void 0 : page.$eval("div[class=sell-value]", (ele) => ele === null || ele === void 0 ? void 0 : ele.textContent));
    yield browser.close();
    return {
        sell_price: parseSellPrice(sell_price),
        buy_price: parseBuyPrice(buy_price),
        source,
    };
});
exports.default = { getQuotesOnAmbito, getQuotesOnCronista, getQuotesOnDolarHoy };
