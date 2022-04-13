"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quotes_routes_1 = __importDefault(require("./quotes.routes"));
const average_routes_1 = __importDefault(require("./average.routes"));
const slippage_routes_1 = __importDefault(require("./slippage.routes"));
const router = (0, express_1.Router)();
router.use("/quotes", quotes_routes_1.default);
router.use("/average", average_routes_1.default);
router.use("/slippage", slippage_routes_1.default);
exports.default = router;
