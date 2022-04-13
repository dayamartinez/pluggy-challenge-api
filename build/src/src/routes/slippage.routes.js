"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slippage_controller_1 = __importDefault(require("../controllers/slippage.controller"));
const router = (0, express_1.Router)();
router.get("/", slippage_controller_1.default.slippage);
exports.default = router;
