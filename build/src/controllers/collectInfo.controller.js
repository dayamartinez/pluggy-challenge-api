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
const dataset_config_1 = __importDefault(require("../../config/dataset.config"));
const querySanity_1 = __importDefault(require("../../constants/querySanity"));
const utils_1 = __importDefault(require("../../utils"));
class collectInfoController {
    static collectInformation() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { getQuotesOnAmbito, getQuotesOnCronista, getQuotesOnDolarHoy } = utils_1.default;
            try {
                const { QUERY_AVERAGE, QUERY_SLIPPAGE, QUOTES_QUERY } = querySanity_1.default;
                const [ambitoResponse, dolarHoyResponse, cronistaResponse] = yield Promise.all([
                    getQuotesOnAmbito(),
                    getQuotesOnDolarHoy(),
                    getQuotesOnCronista(),
                ]);
                if (ambitoResponse && dolarHoyResponse && cronistaResponse) {
                    const quotesType = "quotes";
                    const averageType = "average";
                    const slippageType = "slippage";
                    const average_buy_price = (ambitoResponse.buy_price +
                        dolarHoyResponse.buy_price +
                        cronistaResponse.buy_price) /
                        3;
                    const average_sell_price = (ambitoResponse.sell_price +
                        dolarHoyResponse.sell_price +
                        cronistaResponse.sell_price) /
                        3;
                    const responseQuotesDB = yield dataset_config_1.default.fetch(QUOTES_QUERY);
                    if (!(responseQuotesDB === null || responseQuotesDB === void 0 ? void 0 : responseQuotesDB.length)) {
                        //FIRSTIME
                        const initialSlippage = {
                            _type: slippageType,
                            buy_price_slippage: 0,
                            sell_price_slippage: 0,
                        };
                        yield dataset_config_1.default.create(Object.assign({ _type: quotesType }, ambitoResponse));
                        yield dataset_config_1.default.create(Object.assign({ _type: quotesType }, dolarHoyResponse));
                        yield dataset_config_1.default.create(Object.assign({ _type: quotesType }, cronistaResponse));
                        yield dataset_config_1.default.create({
                            _type: averageType,
                            average_buy_price,
                            average_sell_price,
                        });
                        yield dataset_config_1.default.create(Object.assign(Object.assign({}, initialSlippage), { source: ambitoResponse.source }));
                        yield dataset_config_1.default.create(Object.assign(Object.assign({}, initialSlippage), { source: ambitoResponse.source }));
                        yield dataset_config_1.default.create(Object.assign(Object.assign({}, initialSlippage), { source: ambitoResponse.source }));
                        return "Created successfy";
                    }
                    //FINDED
                    const responseAverageDB = yield dataset_config_1.default.fetch(QUERY_AVERAGE);
                    const responseSlippageDB = yield dataset_config_1.default.fetch(QUERY_SLIPPAGE);
                    const findSlippage = (source, buyPricePreview, buyPriceCurrent, sellPricePreview, sellPriceCurrent) => __awaiter(this, void 0, void 0, function* () {
                        const diffBuyPrice = buyPriceCurrent - buyPricePreview;
                        const diffSellPrice = sellPriceCurrent - sellPricePreview;
                        let findedSlippage = responseSlippageDB === null || responseSlippageDB === void 0 ? void 0 : responseSlippageDB.find((element) => element.source === source);
                        if (findedSlippage) {
                            yield dataset_config_1.default
                                .patch(findedSlippage._id)
                                .set({
                                buy_price: diffBuyPrice,
                                sell_price: diffSellPrice,
                            })
                                .commit();
                        }
                    });
                    yield responseQuotesDB.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                        const { source, buy_price, sell_price, _id } = element;
                        if (source === ambitoResponse.source) {
                            if (buy_price !== ambitoResponse.buy_price ||
                                sell_price !== ambitoResponse.sell_price)
                                yield findSlippage(source, buy_price, ambitoResponse.buy_price, sell_price, ambitoResponse.sell_price);
                            yield dataset_config_1.default
                                .patch(_id)
                                .set({
                                buy_price: ambitoResponse.buy_price,
                                sell_price: ambitoResponse.sell_price,
                            })
                                .commit();
                        }
                        if (source === dolarHoyResponse.source) {
                            if (buy_price !== dolarHoyResponse.buy_price ||
                                sell_price !== dolarHoyResponse.sell_price)
                                yield findSlippage(source, buy_price, dolarHoyResponse.buy_price, sell_price, dolarHoyResponse.sell_price);
                            yield dataset_config_1.default
                                .patch(_id)
                                .set({
                                buy_price: dolarHoyResponse.buy_price,
                                sell_price: dolarHoyResponse.sell_price,
                            })
                                .commit();
                        }
                        if (source === cronistaResponse.source) {
                            if (buy_price !== cronistaResponse.buy_price ||
                                sell_price !== cronistaResponse.sell_price)
                                yield findSlippage(source, buy_price, cronistaResponse.buy_price, sell_price, cronistaResponse.sell_price);
                            yield dataset_config_1.default
                                .patch(_id)
                                .set({
                                buy_price: cronistaResponse.buy_price,
                                sell_price: cronistaResponse.sell_price,
                            })
                                .commit();
                        }
                    }));
                    if (responseAverageDB.length) {
                        const id = (_a = responseAverageDB[0]) === null || _a === void 0 ? void 0 : _a._id;
                        const updatedAverage = yield dataset_config_1.default
                            .patch(id)
                            .set({
                            average_buy_price,
                            average_sell_price,
                        })
                            .commit();
                        if (!updatedAverage)
                            return "an error ocurred to updated average";
                    }
                    return "Updated successfy";
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = collectInfoController;
