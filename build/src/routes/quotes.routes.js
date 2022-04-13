"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quotes_controller_1 = __importDefault(require("../controllers/quotes.controller"));
const router = (0, express_1.Router)();
router.get("/", quotes_controller_1.default.quotes);
exports.default = router;
