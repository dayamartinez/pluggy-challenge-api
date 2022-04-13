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
const messages_1 = __importDefault(require("../../constants/messages"));
const querySanity_1 = __importDefault(require("../../constants/querySanity"));
class averageController {
    static average(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { GET_AVERAGE_ERROR } = messages_1.default.errorMessage;
            try {
                const { QUERY_AVERAGE } = querySanity_1.default;
                const resultAverage = yield dataset_config_1.default.fetch(QUERY_AVERAGE);
                if (!(resultAverage === null || resultAverage === void 0 ? void 0 : resultAverage.length)) {
                    return res.status(200).send({ result: {} });
                }
                return res.status(200).send({ result: resultAverage[0] });
            }
            catch (error) {
                return res
                    .status(400)
                    .json({ error, message: GET_AVERAGE_ERROR, result: {} });
            }
        });
    }
}
exports.default = averageController;
