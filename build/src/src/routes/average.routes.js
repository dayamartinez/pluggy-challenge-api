"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const average_controller_1 = __importDefault(require("../controllers/average.controller"));
const router = (0, express_1.Router)();
router.get("/", average_controller_1.default.average);
exports.default = router;
